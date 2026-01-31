"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Widget } from "@/types/database";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Pencil,
  Trash2,
  Code2,
  Eye,
  MousePointerClick,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface WidgetCardProps {
  widget: Widget;
  testimonials?: any[];
}

const layoutLabels = {
  grid: "Grid",
  carousel: "Carousel",
  spotlight: "Spotlight",
  wall: "Wall of Love",
  badge: "Badge",
};

export function WidgetCard({ widget }: WidgetCardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("widgets")
        .delete()
        .eq("id", widget.id);

      if (error) throw error;

      toast.success("Widget deleted");
      setDeleteDialogOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to delete widget");
    } finally {
      setLoading(false);
    }
  };

  const embedCode = `<div id="testimonialstack-widget-${widget.id}"></div>
<script src="${process.env.NEXT_PUBLIC_APP_URL || ''}/embed.js" data-widget-id="${widget.id}" async></script>`;

  const handleCopyEmbed = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success("Embed code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">{widget.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEmbedDialogOpen(true)}>
                <Code2 className="w-4 h-4 mr-2" />
                Get Embed Code
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/widgets/${widget.id}/preview`}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Preview
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/widgets/${widget.id}/edit`}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
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
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{layoutLabels[widget.layout]}</Badge>
            <Badge variant={widget.is_active ? "default" : "outline"}>
              {widget.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Testimonials</p>
              <p className="font-medium">{widget.testimonial_ids.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Impressions</p>
              <p className="font-medium">{widget.impressions.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setEmbedDialogOpen(true)}
          >
            <Code2 className="w-4 h-4" />
            Get Embed Code
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete widget</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{widget.name}&quot;? This will remove the
              widget from any websites where it&apos;s embedded.
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

      {/* Embed Dialog */}
      <Dialog open={embedDialogOpen} onOpenChange={setEmbedDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Embed Widget</DialogTitle>
            <DialogDescription>
              Copy and paste this code into your website where you want the widget to
              appear.
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <pre className="p-4 bg-slate-900 text-slate-50 rounded-lg text-sm overflow-x-auto">
              <code>{embedCode}</code>
            </pre>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2 gap-2"
              onClick={handleCopyEmbed}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmbedDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
