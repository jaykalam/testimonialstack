import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { WidgetEditForm } from "@/components/dashboard/widget-edit-form";

export default async function EditWidgetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: widget } = await supabase
    .from("widgets")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!widget) {
    notFound();
  }

  // Fetch approved testimonials
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/widgets">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Widget</h1>
          <p className="text-muted-foreground">Update your widget settings</p>
        </div>
      </div>

      <WidgetEditForm widget={widget} allTestimonials={testimonials || []} />
    </div>
  );
}
