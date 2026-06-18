"use client";

import { useState } from "react";
import { deleteBlogAction } from "@/lib/actions/blog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteBlogButtonProps {
  id: string;
  title: string;
}

export function DeleteBlogButton({ id, title }: DeleteBlogButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const response = await deleteBlogAction(id);
    
    if (response?.error) {
      toast.error(response.error);
      setIsDeleting(false);
    } else {
      toast.success(`"${title}" deleted successfully.`);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
            disabled={isDeleting}
          />
        }
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will hide &quot;{title}&quot; from the website. You can restore it later if needed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Delete Blog
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
