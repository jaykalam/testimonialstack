    // @ts-ignore
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Code2, Eye, MousePointerClick } from "lucide-react";
import { WidgetCard } from "@/components/dashboard/widget-card";
import { Widget } from "@/types/database";

export default async function WidgetsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: widgets } = await supabase
    .from("widgets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Type guard
  const userWidgets = (widgets as Widget[] | null) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Widgets</h1>
          <p className="text-muted-foreground">
            Create and manage embeddable testimonial widgets
          </p>
        </div>
        <Link href="/dashboard/widgets/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Widget
          </Button>
        </Link>
      </div>

      {userWidgets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userWidgets.map((widget: Widget) => (
            <WidgetCard key={widget.id} widget={widget} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Code2 className="w-12 h-12 text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground mb-4">No widgets created yet</p>
            <Link href="/dashboard/widgets/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create your first widget
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {userWidgets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Widget Analytics</CardTitle>
            <CardDescription>
              Overview of all your widget performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Code2 className="w-4 h-4" />
                  <span className="text-sm">Total Widgets</span>
                </div>
                <p className="text-2xl font-bold">{userWidgets.length}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Total Impressions</span>
                </div>
                <p className="text-2xl font-bold">
                  {userWidgets.reduce((sum, w) => sum + w.impressions, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MousePointerClick className="w-4 h-4" />
                  <span className="text-sm">Total Clicks</span>
                </div>
                <p className="text-2xl font-bold">
                  {userWidgets.reduce((sum, w) => sum + w.clicks, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
