import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestimonialCard } from "@/components/dashboard/testimonial-card";
import { Plus, Quote } from "lucide-react";

export default async function TestimonialsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const allTestimonials = testimonials || [];
  const pendingTestimonials = allTestimonials.filter((t) => t.status === "pending");
  const approvedTestimonials = allTestimonials.filter((t) => t.status === "approved");
  const rejectedTestimonials = allTestimonials.filter((t) => t.status === "rejected");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground">
            Manage and organize your customer testimonials
          </p>
        </div>
        <Link href="/dashboard/testimonials/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Testimonial
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            All
            <Badge variant="secondary">{allTestimonials.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            Pending
            <Badge variant="secondary">{pendingTestimonials.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            Approved
            <Badge variant="secondary">{approvedTestimonials.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            Rejected
            <Badge variant="secondary">{rejectedTestimonials.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <TestimonialList testimonials={allTestimonials} />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <TestimonialList testimonials={pendingTestimonials} />
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <TestimonialList testimonials={approvedTestimonials} />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <TestimonialList testimonials={rejectedTestimonials} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TestimonialList({
  testimonials,
}: {
  testimonials: Awaited<
    ReturnType<
      Awaited<ReturnType<typeof createClient>>["from"]
    >
  >["data"];
}) {
  if (!testimonials || testimonials.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Quote className="w-12 h-12 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground">No testimonials found</p>
          <Link href="/dashboard/testimonials/new" className="mt-4">
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Add your first testimonial
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  );
}
