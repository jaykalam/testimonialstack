import { createClient } from "@/lib/supabase/server"
import { TIER_LIMITS, Profile } from "@/types/database"
import { getSubscriptionDetails } from "@/lib/lemonsqueezy/client"
import { CurrentPlanCard } from "@/components/billing/current-plan-card"
import { PricingComparison } from "@/components/billing/pricing-comparison"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { success?: string }
}) {
  // 1. Get authenticated user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // 2. Get profile with subscription data
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) return null

  // TypeScript type guard
  const userProfile = profile as Profile

  // 3. Get Lemon Squeezy subscription details if subscribed
  let subscriptionDetails: any = undefined
  if (userProfile.lemon_squeezy_subscription_id) {
    try {
      subscriptionDetails = await getSubscriptionDetails(userProfile.lemon_squeezy_subscription_id)
    } catch (error) {
      console.error("Failed to fetch subscription details:", error)
    }
  }

  // 4. Render components
  return (
    <div className="space-y-6">
      {searchParams.success === "true" && (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Subscription upgraded successfully! Your new plan is now active.
          </AlertDescription>
        </Alert>
      )}

      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing</p>
      </div>

      <CurrentPlanCard profile={userProfile} subscriptionDetails={subscriptionDetails} />

      <div>
        <h2 className="text-2xl font-semibold mb-4">Available Plans</h2>
        <PricingComparison
          currentTier={userProfile.subscription_tier}
          currentStatus={userProfile.subscription_status}
          userId={user.id}
          userEmail={user.email!}
          userName={userProfile.full_name}
        />
      </div>
    </div>
  )
}
