import { getAllBlogs } from "@/services/blog";
import { format } from "date-fns";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye } from "lucide-react";
import { DeleteBlogButton } from "@/components/admin/delete-blog-button";
import { RestoreBlogButton } from "@/components/admin/restore-blog-button";

interface PageProps {
  searchParams: Promise<{
    trash?: string;
  }>;
}

export default async function AdminBlogsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const showDeleted = params.trash === "true";
  const blogs = await getAllBlogs({ showDeletedOnly: showDeleted });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Blogs
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Manage your blog posts, statuses, and visibility.
          </p>
        </div>
        <Link href="/admin/blogs/new">
          <Button>
            <Plus className="h-4 w-4" /> New Blog
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800">
        <Link
          href="/admin/blogs"
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-[2px] transition-colors ${
            !showDeleted
              ? "border-neutral-900 text-neutral-900 dark:border-neutral-50 dark:text-neutral-50"
              : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          }`}
        >
          All Blogs
        </Link>
        <Link
          href="/admin/blogs?trash=true"
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-[2px] transition-colors ${
            showDeleted
              ? "border-neutral-900 text-neutral-900 dark:border-neutral-50 dark:text-neutral-50"
              : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          }`}
        >
          Trash (Deleted)
        </Link>
      </div>

      <div className="rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Published At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No blogs found.
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="text-sm">{blog.title}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        /{blog.slug}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        blog.status === "PUBLISHED"
                          ? "default"
                          : blog.status === "DRAFT"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {blog.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{blog.viewCount}</TableCell>
                  <TableCell className="text-neutral-500 dark:text-neutral-400">
                    {blog.publishedAt
                      ? format(new Date(blog.publishedAt), "MMM d, yyyy")
                      : "Not published"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {showDeleted ? (
                        <RestoreBlogButton id={blog.id} title={blog.title} />
                      ) : (
                        <>
                          <Link href={`/blog/${blog.slug}`} target="_blank">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/blogs/${blog.id}/edit`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DeleteBlogButton id={blog.id} title={blog.title} />
                        </>
                      )}
                    </div>
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

