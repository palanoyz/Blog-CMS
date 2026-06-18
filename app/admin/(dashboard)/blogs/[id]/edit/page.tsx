import { getBlogById } from "@/services/blog";
import { BlogForm } from "@/components/admin/blog-form";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog || blog.deletedAt !== null) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Edit Blog
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Update the details below to edit the blog post.
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
        <BlogForm initialData={blog} />
      </div>
    </div>
  );
}
