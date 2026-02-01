    // @ts-ignore
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TIER_LIMITS, Profile, Widget, Testimonial } from "@/types/database";
import {
  Quote,
  Code2,
  Eye,
  MousePointerClick,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Type guard for profile
  const userProfile = profile as Profile | null;

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: widgets } = await supabase
    .from("widgets")
    .select("*")
    .eq("user_id", user.id);

  // Type guards
  const userTestimonials = testimonials as Testimonial[] | null;
  const userWidgets = widgets as Widget[] | null;

  const tier = userProfile?.subscription_tier || "free";
  const limits = TIER_LIMITS[tier];
  const testimonialCount = userProfile?.testimonial_count || 0;
  const widgetCount = userProfile?.widget_count || 0;

  const totalImpressions = userWidgets?.reduce((sum, w) => sum + w.impressions, 0) || 0;
  const totalClicks = userWidgets?.reduce((sum, w) => sum + w.clicks, 0) || 0;

  const pendingTestimonials = userTestimonials?.filter(t => t.status === "pending").length || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile?.full_name?.split(" ")[0] || "there"}!
          </p>
        </div>
        <Link href="/dashboard/testimonials/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Testimonial
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
            <Quote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testimonialCount}</div>
            <p className="text-xs text-muted-foreground">
              {limits.testimonials === Infinity
                ? "Unlimited"
                : `${testimonialCount} / ${limits.testimonials} used`}
            </p>
            {pendingTestimonials > 0 && (
              <Badge variant="secondary" className="mt-2">
                {pendingTestimonials} pending review
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Widgets</CardTitle>
            <Code2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{widgetCount}</div>
            <p className="text-xs text-muted-foreground">
              {limits.widgets === Infinity
                ? "Unlimited"
                : `${widgetCount} / ${limits.widgets} used`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalImpressions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Widget views all time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {totalImpressions > 0
                ? `${((totalClicks / totalImpressions) * 100).toFixed(1)}% CTR`
                : "No data yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Collect Testimonials</CardTitle>
            <CardDescription>
              Create a collection page to gather testimonials from customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/collection-pages/new">
              <Button variant="outline" className="w-full gap-2">
                Create Collection Page
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create a Widget</CardTitle>
            <CardDescription>
              Embed testimonials on your website with customizable widgets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/widgets/new">
              <Button variant="outline" className="w-full gap-2">
                Create Widget
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {tier === "free" && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Upgrade to Pro
              </CardTitle>
              <CardDescription>
                Get unlimited testimonials, widgets, and remove branding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/billing">
                <Button className="w-full gap-2">
                  View Plans
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Testimonials */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Testimonials</CardTitle>
            <CardDescription>
              Your latest testimonials from customers
            </CardDescription>
          </div>
          <Link href="/dashboard/testimonials">
            <Button variant="ghost" size="sm" className="gap-2">
              View all
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {userTestimonials && userTestimonials.length > 0 ? (
            <div className="space-y-4">
              {userTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex items-start gap-4 p-4 rounded-lg border"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-primary">
                      {testimonial.author_name[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{testimonial.author_name}</span>
                      <Badge
                        variant={
                          testimonial.status === "approved"
                            ? "default"
                            : testimonial.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {testimonial.status}
                      </Badge>
                    </div>
                    {testimonial.author_title && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {testimonial.author_title}
                        {testimonial.author_company &&
                          ` at ${testimonial.author_company}`}
                      </p>
                    )}
                    <p className="text-sm line-clamp-2">{testimonial.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Quote className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No testimonials yet</p>
              <p className="text-sm">
                Create a collection page or add testimonials manually
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
