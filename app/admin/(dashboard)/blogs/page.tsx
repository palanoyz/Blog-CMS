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
import { Plus, Edit, Eye, Trash2 } from "lucide-react";

export default async function AdminBlogsPage() {
  const blogs = await getAllBlogs();

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
                  No blogs found. Create your first post!
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
                      <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
