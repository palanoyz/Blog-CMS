import { getBlogBySlug, incrementBlogViewCount } from "@/services/blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { CommentForm } from "@/components/blog/comment-form";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) return { title: "Blog Not Found" };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://blogcms.com";
  const url = `${baseUrl}/blog/${blog.slug}`;

  return {
    title: blog.title,
    description: blog.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url: url,
      images: [
        {
          url: blog.coverImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: "article",
      publishedTime: blog.publishedAt?.toISOString(),
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Increment view count
  await incrementBlogViewCount(blog.id);

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      {/* Hero Section */}
      <header className="mb-12 text-center">
        <div className="mb-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {blog.publishedAt ? format(new Date(blog.publishedAt), "MMMM d, yyyy") : "Draft"}
          <span className="mx-2">•</span>
          <span>{blog.viewCount} views</span>
        </div>
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-5xl">
          {blog.title}
        </h1>
        <div className="relative aspect-21/9 w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </header>

      {/* Content Section */}
      <div className="prose prose-neutral mx-auto mb-12 dark:prose-invert lg:prose-lg">
        <p className="lead text-xl text-neutral-600 dark:text-neutral-300">
          {blog.excerpt}
        </p>
        <div className="mt-8 whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
          {blog.content}
        </div>
      </div>

      {/* Image Gallery */}
      {blog.images.length > 0 && (
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Gallery
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {blog.images.map((img) => (
              <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg shadow-sm">
                <Image
                  src={img.imageUrl}
                  alt="Gallery image"
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Comments Section */}
      <section className="border-t border-neutral-200 pt-16 dark:border-neutral-800">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-8 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              Comments ({blog.comments.length})
            </h2>
            <div className="space-y-8">
              {blog.comments.length === 0 ? (
                <p className="text-neutral-500 dark:text-neutral-400">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                blog.comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/30">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {comment.senderName}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                      </span>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      {comment.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
          <div>
            <CommentForm blogId={blog.id} />
          </div>
        </div>
      </section>
    </article>
  );
}
