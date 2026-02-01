"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TIER_LIMITS, SubscriptionTier, SubscriptionStatus } from "@/types/database"

interface Props {
  profile: {
    subscription_tier: SubscriptionTier
    subscription_status: SubscriptionStatus
    testimonial_count: number
    widget_count: number
  }
  subscriptionDetails?: any
}

export function CurrentPlanCard({ profile, subscriptionDetails }: Props) {
  const tier = profile.subscription_tier
  const status = profile.subscription_status
  const limits = TIER_LIMITS[tier]

  const tierColors: Record<SubscriptionTier, string> = {
    free: "bg-slate-100 text-slate-700",
    starter: "bg-blue-100 text-blue-700",
    pro: "bg-purple-100 text-purple-700",
  }

  const tierLabels: Record<SubscriptionTier, string> = {
    free: "Free",
    starter: "Starter",
    pro: "Pro",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Current Plan</span>
          <Badge className={tierColors[tier]}>
            {tierLabels[tier]}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Testimonials</p>
            <p className="text-2xl font-bold">
              {profile.testimonial_count} / {limits.testimonials === Infinity ? "∞" : limits.testimonials}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Widgets</p>
            <p className="text-2xl font-bold">
              {profile.widget_count} / {limits.widgets === Infinity ? "∞" : limits.widgets}
            </p>
          </div>
        </div>

        {status === "active" && subscriptionDetails && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Renews on {new Date(subscriptionDetails.data.attributes.renews_at).toLocaleDateString()}
            </p>
          </div>
        )}

        {status === "cancelled" && subscriptionDetails && (
          <div className="pt-4 border-t">
            <p className="text-sm text-orange-600">
              Your subscription will end on {new Date(subscriptionDetails.data.attributes.ends_at).toLocaleDateString()}
            </p>
          </div>
        )}

        {status === "past_due" && (
          <div className="pt-4 border-t">
            <p className="text-sm text-red-600">
              Payment failed. Please update your payment method.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
