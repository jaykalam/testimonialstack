"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Testimonial } from "@/types/database";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  Check,
  X,
  Pencil,
  Trash2,
  Star,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleStatusChange = async (status: "approved" | "rejected") => {
    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from("testimonials")
        .update({ status })
        .eq("id", testimonial.id);

      if (error) throw error;

      toast.success(`Testimonial ${status}`);
      router.refresh();
    } catch {
      toast.error("Failed to update testimonial");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async () => {
    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from("testimonials")
        .update({ is_featured: !testimonial.is_featured })
        .eq("id", testimonial.id);

      if (error) throw error;

      toast.success(
        testimonial.is_featured
          ? "Removed from featured"
          : "Added to featured"
      );
      router.refresh();
    } catch {
      toast.error("Failed to update testimonial");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", testimonial.id);

      if (error) throw error;

      toast.success("Testimonial deleted");
      setDeleteDialogOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to delete testimonial");
    } finally {
      setLoading(false);
    }
  };

  const initials = testimonial.author_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <>
      <Card className="flex flex-col">
        <CardContent className="flex-1 pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={testimonial.author_avatar_url || undefined} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{testimonial.author_name}</p>
                  {testimonial.is_featured && (
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
                {(testimonial.author_title || testimonial.author_company) && (
                  <p className="text-sm text-muted-foreground">
                    {testimonial.author_title}
                    {testimonial.author_title &&
                      testimonial.author_company &&
                      " at "}
                    {testimonial.author_company}
                  </p>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={loading}>
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {testimonial.status === "pending" && (
                  <>
                    <DropdownMenuItem onClick={() => handleStatusChange("approved")}>
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("rejected")}>
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {testimonial.status === "approved" && (
                  <>
                    <DropdownMenuItem onClick={handleToggleFeatured}>
                      <Star className="w-4 h-4 mr-2" />
                      {testimonial.is_featured ? "Remove from featured" : "Add to featured"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <a href={`/dashboard/testimonials/${testimonial.id}/edit`}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </a>
                </DropdownMenuItem>
                {testimonial.source_url && (
                  <DropdownMenuItem asChild>
                    <a
                      href={testimonial.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View source
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {testimonial.rating && (
            <div className="flex items-center gap-0.5 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= testimonial.rating!
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
          )}

          <p className="text-sm line-clamp-4">{testimonial.content}</p>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t pt-4">
          <Badge className={statusColors[testimonial.status]}>
            {testimonial.status}
          </Badge>
          <span className="text-xs text-muted-foreground" suppressHydrationWarning>
            {new Date(testimonial.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </CardFooter>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete testimonial</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this testimonial from{" "}
              {testimonial.author_name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
