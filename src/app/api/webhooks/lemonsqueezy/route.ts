import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { createAdminClient } from "@/lib/supabase/admin"
import type { SubscriptionTier, SubscriptionStatus } from "@/types/database"

export const runtime = "nodejs" // Required for crypto module
export const dynamic = "force-dynamic" // Prevent caching

// Verify webhook signature
function verifySignature(rawBody: string, signature: string): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!
  const hmac = crypto.createHmac("sha256", secret)
  hmac.update(rawBody)
  const digest = hmac.digest("hex")
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}

// Map variant ID to tier
function variantToTier(variantId: string): "starter" | "pro" {
  if (variantId === process.env.LEMON_SQUEEZY_STARTER_VARIANT_ID) return "starter"
  if (variantId === process.env.LEMON_SQUEEZY_PRO_VARIANT_ID) return "pro"
  throw new Error(`Unknown variant ID: ${variantId}`)
}

export async function POST(request: NextRequest) {
  try {
    // 1. Get raw body and signature
    const rawBody = await request.text()
    const signature = request.headers.get("X-Signature")

    if (!signature || !verifySignature(rawBody, signature)) {
      console.error("Invalid webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // 2. Parse payload
    const payload = JSON.parse(rawBody)
    const eventName = payload.meta.event_name
    const customData = payload.meta.custom_data
    const userId = customData?.user_id
    const attributes = payload.data.attributes

    if (!userId) {
      console.error("No user_id in custom data")
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
    }

    // 3. Use admin client to bypass RLS
    const supabase = createAdminClient()

    // 4. Handle different event types
    switch (eventName) {
      case "subscription_created":
      case "subscription_updated": {
        const tier = variantToTier(attributes.variant_id.toString())
        await (supabase
          .from("profiles")
          .update as any)({
            subscription_tier: tier,
            subscription_status: attributes.status,
            lemon_squeezy_customer_id: String(attributes.customer_id),
            lemon_squeezy_subscription_id: String(payload.data.id),
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)
        break
      }

      case "subscription_cancelled": {
        await (supabase
          .from("profiles")
          .update as any)({
            subscription_status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)
        break
      }

      case "subscription_expired": {
        await (supabase
          .from("profiles")
          .update as any)({
            subscription_tier: "free",
            subscription_status: "expired",
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)
        break
      }

      case "subscription_payment_failed": {
        await (supabase
          .from("profiles")
          .update as any)({
            subscription_status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)
        break
      }
    }

    console.log(`Webhook processed: ${eventName} for user ${userId}`)
    return NextResponse.json({ received: true }, { status: 200 })

  } catch (error) {
    console.error("Webhook error:", error)
    // Return 200 to prevent Lemon Squeezy retries
    return NextResponse.json({ error: "Processing failed" }, { status: 200 })
  }
}
