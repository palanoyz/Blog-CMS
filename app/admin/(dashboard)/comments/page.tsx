import { prisma } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { CommentStatus } from "@/app/generated/prisma/enums";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CommentActions } from "@/components/admin/comment-actions";

interface PageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function AdminCommentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const statusParam = params.status;

  const validStatuses = ["PENDING", "APPROVED", "REJECTED"];
  const statusFilter = validStatuses.includes(statusParam || "")
    ? (statusParam as CommentStatus)
    : undefined;

  const where = statusFilter ? { status: statusFilter } : {};

  const comments = await prisma.comment.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      blog: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });

  const tabItems = [
    { label: "All", value: undefined },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Comments
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Moderate user comments submitted on your blog posts.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800">
        {tabItems.map((tab) => {
          const isActive = statusParam === tab.value;
          const href = tab.value ? `/admin/comments?status=${tab.value}` : "/admin/comments";
          return (
            <Link
              key={tab.label}
              href={href}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-0.5 transition-colors ${isActive
                  ? "border-neutral-900 text-neutral-900 dark:border-neutral-50 dark:text-neutral-50"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Commenter</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Blog Post</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No comments found.
                </TableCell>
              </TableRow>
            ) : (
              comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium">
                    {comment.senderName}
                  </TableCell>
                  <TableCell className="max-w-xs truncate md:max-w-md">
                    <span title={comment.message}>{comment.message}</span>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/blog/${comment.blog.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {comment.blog.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        comment.status === "APPROVED"
                          ? "default"
                          : comment.status === "PENDING"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {comment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-neutral-500 dark:text-neutral-400">
                    {format(new Date(comment.createdAt), "MMM d, yyyy h:mm a")}
                  </TableCell>
                  <TableCell className="text-right">
                    <CommentActions id={comment.id} status={comment.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
