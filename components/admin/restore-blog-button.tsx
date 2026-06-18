"use client";

import { useState } from "react";
import { restoreBlogAction } from "@/lib/actions/blog";
import { Button } from "@/components/ui/button";
import { RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RestoreBlogButtonProps {
  id: string;
  title: string;
}

export function RestoreBlogButton({ id, title }: RestoreBlogButtonProps) {
  const [isRestoring, setIsRestoring] = useState(false);

  async function handleRestore() {
    setIsRestoring(true);
    const response = await restoreBlogAction(id);

    if (response?.error) {
      toast.error(response.error);
      setIsRestoring(false);
    } else {
      toast.success(`"${title}" restored successfully.`);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950/30"
      disabled={isRestoring}
      onClick={handleRestore}
      title="Restore Blog"
    >
      {isRestoring ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RotateCcw className="h-4 w-4" />
      )}
    </Button>
  );
}
