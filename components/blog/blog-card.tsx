import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

interface BlogCardProps {
  blog: {
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    publishedAt: Date | null;
  };
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950">
      <Link href={`/blog/${blog.slug}`} className="block aspect-video overflow-hidden">
        <Image
          src={blog.coverImage}
          alt={blog.title}
          width={800}
          height={450}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="p-5">
        <div className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
          {blog.publishedAt ? format(new Date(blog.publishedAt), "MMMM d, yyyy") : "Draft"}
        </div>
        <Link href={`/blog/${blog.slug}`}>
          <h3 className="mb-2 text-xl font-semibold leading-tight text-neutral-900 dark:text-neutral-50 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {blog.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-neutral-600 dark:text-neutral-400">
          {blog.excerpt}
        </p>
      </div>
    </div>
  );
}
