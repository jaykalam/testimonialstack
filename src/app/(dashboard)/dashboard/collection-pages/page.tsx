import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Copy, ExternalLink, Eye } from "lucide-react";
import { CollectionPageCard } from "@/components/dashboard/collection-page-card";

export default async function CollectionPagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: pages } = await supabase
    .from("collection_pages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Collection Pages</h1>
          <p className="text-muted-foreground">
            Create public pages for customers to submit testimonials
          </p>
        </div>
        <Link href="/dashboard/collection-pages/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Collection Page
          </Button>
        </Link>
      </div>

      {pages && pages.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {pages.map((page) => (
            <CollectionPageCard
              key={page.id}
              page={page}
              appUrl={appUrl}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="w-12 h-12 text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground mb-4">No collection pages yet</p>
            <Link href="/dashboard/collection-pages/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create your first collection page
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>How Collection Pages Work</CardTitle>
          <CardDescription>
            Share your public link with customers to gather testimonials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium">Create a collection page</p>
                <p className="text-sm text-muted-foreground">
                  Set your branding, questions, and thank you message
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium">Share your link</p>
                <p className="text-sm text-muted-foreground">
                  Send the public URL to customers, social media, or emails
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium">Review testimonials</p>
                <p className="text-sm text-muted-foreground">
                  Submitted testimonials appear in your dashboard for approval
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
