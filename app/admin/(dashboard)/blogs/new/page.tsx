import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Create New Blog
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Fill in the details below to create a new blog post.
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
        <BlogForm />
      </div>
    </div>
  );
}
