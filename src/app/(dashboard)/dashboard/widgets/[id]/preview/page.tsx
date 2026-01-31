import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WidgetRenderer } from "@/components/widgets/widget-renderer";
import { ArrowLeft } from "lucide-react";

export default async function WidgetPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: widget } = await supabase
    .from("widgets")
    .select("*")
    .eq("id", id)
    .single();

  if (!widget) {
    notFound();
  }

  // Fetch testimonials for this widget
  const { data: allTestimonials } = await supabase
    .from("testimonials")
    .select("*")
    .in("id", widget.testimonial_ids || []);

  const testimonials = allTestimonials || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/widgets/${id}/edit`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{widget.name}</h1>
            <p className="text-muted-foreground">Preview - {widget.layout} layout</p>
          </div>
        </div>
        <Link href={`/dashboard/widgets/${id}/edit`}>
          <Button>Edit Widget</Button>
        </Link>
      </div>

      <div className="border rounded-lg p-8 bg-white">
        <WidgetRenderer widget={widget} testimonials={testimonials} preview={true} />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-sm mb-2">Embed Code</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Copy and paste this code into your website:
        </p>
        <pre className="bg-slate-900 text-slate-50 p-4 rounded text-xs overflow-x-auto">
          &lt;div id="testimonialstack-widget-{widget.id}"&gt;&lt;/div&gt;
          {'\n'}&lt;script src="{process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/embed.js" data-widget-id="{widget.id}" async&gt;&lt;/script&gt;
        </pre>
      </div>
    </div>
  );
}
