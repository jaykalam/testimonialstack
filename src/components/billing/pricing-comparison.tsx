"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { SubscriptionTier, SubscriptionStatus } from "@/types/database"

interface Props {
  currentTier: SubscriptionTier
  currentStatus: SubscriptionStatus
  userId: string
  userEmail: string
  userName?: string | null
}

export function PricingComparison({ currentTier, currentStatus }: Props) {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleUpgrade(tier: "starter" | "pro") {
    setLoading(tier)
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      })

      const data = await res.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        alert(data.error || "Failed to create checkout")
        setLoading(null)
      }
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
      setLoading(null)
    }
  }

  const tiers = [
    {
      name: "Free",
      price: "$0",
      features: ["3 testimonials", "1 widget", "1 collection page", "TestimonialStack branding"],
      tier: null,
    },
    {
      name: "Starter",
      price: "$19",
      period: "/month",
      features: ["25 testimonials", "3 widgets", "3 collection pages", "No branding", "3 milestones"],
      tier: "starter" as const,
      popular: true,
    },
    {
      name: "Pro",
      price: "$39",
      period: "/month",
      features: [
        "Unlimited testimonials",
        "Unlimited widgets",
        "Unlimited collection pages",
        "No branding",
        "Unlimited milestones",
        "Stripe/LS integration",
        "Twitter/X import",
      ],
      tier: "pro" as const,
    },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {tiers.map((tier) => {
        const isCurrent = tier.tier === currentTier && currentStatus === "active"
        const isDowngrade = tier.tier === null && currentTier !== "free"

        return (
          <Card key={tier.name} className={tier.popular ? "border-2 border-primary md:scale-105" : ""}>
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge>Most Popular</Badge>
              </div>
            )}
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg">{tier.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
              </div>

              {isCurrent ? (
                <Badge variant="outline" className="w-full justify-center py-2">Current Plan</Badge>
              ) : isDowngrade ? (
                <Button variant="outline" className="w-full" disabled>
                  Downgrade
                </Button>
              ) : tier.tier ? (
                <Button
                  className="w-full"
                  onClick={() => handleUpgrade(tier.tier!)}
                  disabled={loading !== null}
                >
                  {loading === tier.tier ? "Loading..." : "Upgrade"}
                </Button>
              ) : null}

              <ul className="mt-6 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
