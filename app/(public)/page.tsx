import { getPublishedBlogs } from "@/services/blog";
import { BlogCard } from "@/components/blog/blog-card";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function PublicBlogListingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";

  const { blogs, pagination } = await getPublishedBlogs({ page, search });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Our Blog
        </h1>
        <form className="relative w-full max-w-sm">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search blogs..."
            className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2 pr-10 text-sm focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
      </div>

      {blogs.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 p-12 text-center dark:border-neutral-800">
          <p className="text-lg font-medium text-neutral-600 dark:text-neutral-400">
            No blogs found matching your search.
          </p>
          <Link
            href="/"
            className="mt-4 text-blue-600 hover:underline dark:text-blue-400"
          >
            Clear search
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <Link
                href={`/?page=${pagination.currentPage - 1}${search ? `&search=${search}` : ""
                  }`}
                className={`rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900 ${!pagination.hasPrevPage
                    ? "pointer-events-none opacity-50"
                    : ""
                  }`}
              >
                Previous
              </Link>
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Link
                href={`/?page=${pagination.currentPage + 1}${search ? `&search=${search}` : ""
                  }`}
                className={`rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900 ${!pagination.hasNextPage
                    ? "pointer-events-none opacity-50"
                    : ""
                  }`}
              >
                Next
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
