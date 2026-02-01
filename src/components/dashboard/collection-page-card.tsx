"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CollectionPage } from "@/types/database";
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
  Copy,
  ExternalLink,
  Eye,
  Pencil,
  Trash2,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface CollectionPageCardProps {
  page: CollectionPage;
  appUrl: string;
}

export function CollectionPageCard({ page, appUrl }: CollectionPageCardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const publicUrl = `${appUrl}/collect/${page.slug}`;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("collection_pages")
        .delete()
        .eq("id", page.id);

      if (error) throw error;

      toast.success("Collection page deleted");
      setDeleteDialogOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to delete collection page");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from("collection_pages")
        .update({ is_active: !page.is_active })
        .eq("id", page.id);

      if (error) throw error;

      toast.success(page.is_active ? "Collection page disabled" : "Collection page enabled");
      router.refresh();
    } catch {
      toast.error("Failed to update collection page");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg">{page.title}</CardTitle>
            <Badge variant={page.is_active ? "default" : "outline"} className="mt-2">
              {page.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleToggleActive}>
                {page.is_active ? "Disable" : "Enable"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/collection-pages/${page.id}/edit`}>
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
          {page.description && (
            <p className="text-sm text-muted-foreground mb-4">{page.description}</p>
          )}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Public Link:</p>
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border">
              <code className="text-xs flex-1 truncate">{publicUrl}</code>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={handleCopyUrl}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href={publicUrl} target="_blank" className="w-full">
            <Button variant="outline" className="w-full gap-2">
              <ExternalLink className="w-4 h-4" />
              Open Public Page
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete collection page</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{page.title}&quot;? Testimonials submitted to this page will not be deleted.
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
