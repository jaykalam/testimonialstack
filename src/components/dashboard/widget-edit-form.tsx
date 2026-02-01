"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Testimonial, Widget, WidgetLayout } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const layoutOptions: { value: WidgetLayout; label: string; description: string }[] = [
  {
    value: "grid",
    label: "Grid",
    description: "Display testimonials in a grid layout",
  },
  {
    value: "carousel",
    label: "Carousel",
    description: "Rotating testimonials with navigation",
  },
  {
    value: "spotlight",
    label: "Spotlight",
    description: "Single testimonial with navigation",
  },
  {
    value: "wall",
    label: "Wall of Love",
    description: "Compact testimonials in a masonry layout",
  },
  {
    value: "badge",
    label: "Badge",
    description: "Compact single testimonial",
  },
];

interface WidgetEditFormProps {
  widget: Widget;
  allTestimonials: Testimonial[];
}

export function WidgetEditForm({ widget, allTestimonials }: WidgetEditFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const settings = widget.settings as any;

  const [formData, setFormData] = useState({
    name: widget.name,
    layout: widget.layout,
    testimonial_ids: widget.testimonial_ids || [],
    backgroundColor: settings.backgroundColor || "#ffffff",
    textColor: settings.textColor || "#1f2937",
    accentColor: settings.accentColor || "#3b82f6",
  });

  const handleToggleTestimonial = (id: string) => {
    setFormData({
      ...formData,
      testimonial_ids: formData.testimonial_ids.includes(id)
        ? formData.testimonial_ids.filter((tid) => tid !== id)
        : [...formData.testimonial_ids, id],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter a widget name");
      return;
    }

    if (formData.testimonial_ids.length === 0) {
      toast.error("Please select at least one testimonial");
      return;
    }

    setLoading(true);

    try {
      const { error } = await (supabase as any)
        .from("widgets")
        .update({
          name: formData.name,
          layout: formData.layout,
          testimonial_ids: formData.testimonial_ids,
          settings: {
            ...settings,
            backgroundColor: formData.backgroundColor,
            textColor: formData.textColor,
            accentColor: formData.accentColor,
          },
        })
        .eq("id", widget.id);

      if (error) throw error;

      toast.success("Widget updated!");
      router.push("/dashboard/widgets");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update widget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Widget Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Widget Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Homepage Testimonials"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="layout">Layout *</Label>
            <Select value={formData.layout} onValueChange={(value) => setFormData({ ...formData, layout: value as WidgetLayout })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {layoutOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {layoutOptions.find((o) => o.value === formData.layout)?.description}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="bg_color">Background Color</Label>
              <div className="flex items-center gap-2">
                <input
                  id="bg_color"
                  type="color"
                  value={formData.backgroundColor}
                  onChange={(e) =>
                    setFormData({ ...formData, backgroundColor: e.target.value })
                  }
                  className="w-12 h-10 rounded-lg border cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.backgroundColor}
                  onChange={(e) =>
                    setFormData({ ...formData, backgroundColor: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text_color">Text Color</Label>
              <div className="flex items-center gap-2">
                <input
                  id="text_color"
                  type="color"
                  value={formData.textColor}
                  onChange={(e) =>
                    setFormData({ ...formData, textColor: e.target.value })
                  }
                  className="w-12 h-10 rounded-lg border cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.textColor}
                  onChange={(e) =>
                    setFormData({ ...formData, textColor: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accent_color">Accent Color</Label>
              <div className="flex items-center gap-2">
                <input
                  id="accent_color"
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) =>
                    setFormData({ ...formData, accentColor: e.target.value })
                  }
                  className="w-12 h-10 rounded-lg border cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) =>
                    setFormData({ ...formData, accentColor: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Select Testimonials *</CardTitle>
          <CardDescription>
            Choose which testimonials to display in this widget
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allTestimonials.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No approved testimonials yet.
            </p>
          ) : (
            <div className="space-y-3">
              {allTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50">
                  <Checkbox
                    id={testimonial.id}
                    checked={formData.testimonial_ids.includes(testimonial.id)}
                    onCheckedChange={() => handleToggleTestimonial(testimonial.id)}
                  />
                  <label
                    htmlFor={testimonial.id}
                    className="flex-1 cursor-pointer"
                  >
                    <p className="font-medium text-sm">{testimonial.author_name}</p>
                    {testimonial.author_company && (
                      <p className="text-xs text-muted-foreground">
                        {testimonial.author_company}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {testimonial.content}
                    </p>
                  </label>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-4">
        <Link href="/dashboard/widgets">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
