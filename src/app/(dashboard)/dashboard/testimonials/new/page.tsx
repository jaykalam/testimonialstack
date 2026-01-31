"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Star } from "lucide-react";
import { toast } from "sonner";

export default function NewTestimonialPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    author_name: "",
    author_email: "",
    author_title: "",
    author_company: "",
    author_social_url: "",
    content: "",
    rating: "",
    source: "manual",
    source_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      const { error } = await supabase.from("testimonials").insert({
        user_id: user.id,
        author_name: formData.author_name,
        author_email: formData.author_email || null,
        author_title: formData.author_title || null,
        author_company: formData.author_company || null,
        author_social_url: formData.author_social_url || null,
        content: formData.content,
        rating: formData.rating ? parseInt(formData.rating) : null,
        source: formData.source,
        source_url: formData.source_url || null,
        status: "approved", // Manual testimonials are auto-approved
      });

      if (error) throw error;

      toast.success("Testimonial added successfully!");
      router.push("/dashboard/testimonials");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add testimonial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/testimonials">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add Testimonial</h1>
          <p className="text-muted-foreground">
            Manually add a testimonial from a customer
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Testimonial Details</CardTitle>
          <CardDescription>
            Enter the details of the testimonial you want to add
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="author_name">Name *</Label>
                <Input
                  id="author_name"
                  placeholder="John Doe"
                  value={formData.author_name}
                  onChange={(e) =>
                    setFormData({ ...formData, author_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author_email">Email</Label>
                <Input
                  id="author_email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.author_email}
                  onChange={(e) =>
                    setFormData({ ...formData, author_email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="author_title">Title/Role</Label>
                <Input
                  id="author_title"
                  placeholder="CEO"
                  value={formData.author_title}
                  onChange={(e) =>
                    setFormData({ ...formData, author_title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author_company">Company</Label>
                <Input
                  id="author_company"
                  placeholder="Acme Inc"
                  value={formData.author_company}
                  onChange={(e) =>
                    setFormData({ ...formData, author_company: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author_social_url">Social Profile URL</Label>
              <Input
                id="author_social_url"
                type="url"
                placeholder="https://twitter.com/johndoe"
                value={formData.author_social_url}
                onChange={(e) =>
                  setFormData({ ...formData, author_social_url: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Testimonial Content *</Label>
              <Textarea
                id="content"
                placeholder="Write the testimonial here..."
                rows={5}
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        rating: formData.rating === star.toString() ? "" : star.toString(),
                      })
                    }
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= parseInt(formData.rating || "0")
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                {formData.rating && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {formData.rating} star{parseInt(formData.rating) !== 1 && "s"}
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) =>
                    setFormData({ ...formData, source: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual Entry</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="product_hunt">Product Hunt</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source_url">Source URL</Label>
                <Input
                  id="source_url"
                  type="url"
                  placeholder="https://..."
                  value={formData.source_url}
                  onChange={(e) =>
                    setFormData({ ...formData, source_url: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <Link href="/dashboard/testimonials">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Testimonial"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
