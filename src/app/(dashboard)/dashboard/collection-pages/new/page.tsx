    // @ts-ignore
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

export default function NewCollectionPagePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    primary_color: "#3b82f6",
    thank_you_message: "Thank you for your testimonial!",
    questions: ["How has our product helped you?"],
  });

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, ""],
    });
  };

  const handleRemoveQuestion = (index: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index),
    });
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.slug.trim()) {
      toast.error("Please enter a URL slug");
      return;
    }

    if (formData.questions.some((q) => !q.trim())) {
      toast.error("Please fill in all questions");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in");
        return;
      }

    // @ts-ignore
      const { error } = await (supabase.from("collection_pages") as any).insert({
        user_id: user.id,
        title: formData.title,
        slug: formData.slug,
        description: formData.description || null,
        primary_color: formData.primary_color,
        thank_you_message: formData.thank_you_message,
        questions: formData.questions,
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("This URL slug is already taken. Try another.");
        } else {
          throw error;
        }
        return;
      }

      toast.success("Collection page created!");
      router.push("/dashboard/collection-pages");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create collection page");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/collection-pages">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create Collection Page</h1>
          <p className="text-muted-foreground">
            Set up a public page for customers to submit testimonials
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
          <CardDescription>
            Configure your collection page branding and questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Acme Corp Testimonials"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                This is shown at the top of your collection page
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">yourapp.com/collect/</span>
                <Input
                  id="slug"
                  placeholder="acme-corp"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value.toLowerCase() })
                  }
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This is the unique URL where customers submit testimonials (letters, numbers, hyphens only)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="A brief description of your product or service..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    id="primary_color"
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) =>
                      setFormData({ ...formData, primary_color: e.target.value })
                    }
                    className="w-12 h-10 rounded-lg border cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={formData.primary_color}
                    onChange={(e) =>
                      setFormData({ ...formData, primary_color: e.target.value })
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thank_you_message">Thank You Message</Label>
                <Input
                  id="thank_you_message"
                  placeholder="Thank you for your testimonial!"
                  value={formData.thank_you_message}
                  onChange={(e) =>
                    setFormData({ ...formData, thank_you_message: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Questions *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleAddQuestion}
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </Button>
              </div>

              <div className="space-y-3">
                {formData.questions.map((question, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Question ${index + 1}`}
                      value={question}
                      onChange={(e) => handleQuestionChange(index, e.target.value)}
                      required
                    />
                    {formData.questions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveQuestion(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Customers will answer these questions when submitting testimonials
              </p>
            </div>

            <div className="flex items-center justify-end gap-4">
              <Link href="/dashboard/collection-pages">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Collection Page"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
