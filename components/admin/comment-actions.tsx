"use client";

import { useTransition } from "react";
import { approveComment, rejectComment } from "@/lib/actions/comment";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CommentStatus } from "@prisma/client";

interface CommentActionsProps {
  id: string;
  status: CommentStatus;
}

export function CommentActions({ id, status }: CommentActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const res = await approveComment(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Comment approved successfully.");
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const res = await rejectComment(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Comment rejected successfully.");
      }
    });
  };

  return (
    <div className="flex gap-2 justify-end">
      {status !== "APPROVED" && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleApprove}
          disabled={isPending}
          className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-950/30"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
          Approve
        </Button>
      )}
      {status !== "REJECTED" && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleReject}
          disabled={isPending}
          className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-950/30"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
          Reject
        </Button>
      )}
    </div>
  );
}
