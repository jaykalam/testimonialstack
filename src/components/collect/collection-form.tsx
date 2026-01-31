"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CollectionPage } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface CollectionFormComponentProps {
  page: CollectionPage;
}

export function CollectionFormComponent({ page }: CollectionFormComponentProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    author_name: "",
    author_email: "",
    author_title: "",
    author_company: "",
    content: "",
    answers: {} as Record<string, string>,
  });

  const questions = Array.isArray(page.questions) ? page.questions : [];

  const handleQuestionChange = (index: number, value: string) => {
    setFormData({
      ...formData,
      answers: {
        ...formData.answers,
        [index]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.author_name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Please enter your testimonial");
      return;
    }

    setLoading(true);

    try {
      // Combine answers into the testimonial content
      const answersText = questions
        .map((q, i) => `${q}\n${formData.answers[i] || ""}`)
        .filter((a) => a.trim())
        .join("\n\n");

      const fullContent = answersText
        ? `${answersText}\n\n${formData.content}`
        : formData.content;

      const { error } = await supabase.from("testimonials").insert({
        user_id: page.user_id,
        collection_page_id: page.id,
        author_name: formData.author_name,
        author_email: formData.author_email || null,
        author_title: formData.author_title || null,
        author_company: formData.author_company || null,
        content: fullContent,
        status: "pending",
        source: "collection_page",
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Testimonial submitted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit testimonial. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
          <h2 className="text-2xl font-bold text-center mb-2">Thank you!</h2>
          <p className="text-center text-muted-foreground mb-4">
            {page.thank_you_message}
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Your testimonial has been submitted and will be reviewed shortly.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{page.title}</CardTitle>
        {page.description && (
          <CardDescription className="text-base">{page.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Your Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="author_name">Full Name *</Label>
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
                  placeholder="e.g., CEO, Product Manager"
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
                  placeholder="e.g., Acme Corp"
                  value={formData.author_company}
                  onChange={(e) =>
                    setFormData({ ...formData, author_company: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          {questions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Questions</h3>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`question-${index}`}>{question}</Label>
                    <Textarea
                      id={`question-${index}`}
                      placeholder="Your answer..."
                      rows={3}
                      value={formData.answers[index] || ""}
                      onChange={(e) => handleQuestionChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Testimonial */}
          <div className="space-y-2">
            <Label htmlFor="content">Your Testimonial *</Label>
            <Textarea
              id="content"
              placeholder="Share your experience with us..."
              rows={5}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            style={{ backgroundColor: page.primary_color }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Testimonial"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By submitting, you agree to have your testimonial displayed on our website.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
