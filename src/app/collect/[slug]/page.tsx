import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CollectionFormComponent } from "@/components/collect/collection-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("collection_pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: `${page.title} - Submit Testimonial`,
    description: page.description || "Submit a testimonial",
  };
}

export default async function CollectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("collection_pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!page) {
    notFound();
  }

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor: page.primary_color + "15" }}
    >
      <div className="max-w-2xl mx-auto">
        <CollectionFormComponent page={page} />
      </div>
    </div>
  );
}
