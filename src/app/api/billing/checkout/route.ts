import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createCheckoutSession } from "@/lib/lemonsqueezy/client"
import { Profile } from "@/types/database"

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Parse and validate request
    const { tier } = await request.json()
    if (!["starter", "pro"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 })
    }

    // 3. Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    // Type guard
    const userProfile = profile as Profile | null

    // 4. Prevent duplicate subscriptions
    if (userProfile?.subscription_tier === tier && userProfile?.subscription_status === "active") {
      return NextResponse.json({ error: "Already subscribed to this tier" }, { status: 400 })
    }

    // 5. Map tier to variant ID
    const variantId = tier === "starter"
      ? process.env.LEMON_SQUEEZY_STARTER_VARIANT_ID
      : process.env.LEMON_SQUEEZY_PRO_VARIANT_ID

    if (!variantId) {
      console.error(`Missing variant ID for tier: ${tier}`)
      return NextResponse.json({ error: "Configuration error" }, { status: 500 })
    }

    // 6. Create checkout session
    const checkout = await createCheckoutSession({
      variantId: variantId,
      userId: user.id,
      userEmail: user.email!,
      userName: userProfile?.full_name || undefined,
    })

    // 7. Return checkout URL
    return NextResponse.json({ checkoutUrl: checkout.data.attributes.url })

  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 })
  }
}
