import { prisma } from "@/lib/db";
import { BlogStatus } from "@prisma/client";

const BLOGS_PER_PAGE = 10;

export async function getPublishedBlogs({
  page = 1,
  search = "",
}: {
  page?: number;
  search?: string;
} = {}) {
  const skip = (page - 1) * BLOGS_PER_PAGE;

  const where = {
    status: "PUBLISHED" as BlogStatus,
    title: {
      contains: search,
      mode: "insensitive" as const,
    },
  };

  const [blogs, totalCount] = await Promise.all([
    prisma.blog.findMany({
      where,
      orderBy: {
        publishedAt: "desc",
      },
      skip,
      take: BLOGS_PER_PAGE,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
      },
    }),
    prisma.blog.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / BLOGS_PER_PAGE);

  return {
    blogs,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function getBlogBySlug(slug: string) {
  return await prisma.blog.findUnique({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      images: {
        select: {
          id: true,
          imageUrl: true,
        },
      },
      comments: {
        where: {
          status: "APPROVED",
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          senderName: true,
          message: true,
          createdAt: true,
        },
      },
    },
  });
}

export async function incrementBlogViewCount(id: string) {
  return await prisma.blog.update({
    where: { id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });
}

export async function getAdminStats() {
  const [blogCount, pendingCommentCount, totalViews] = await Promise.all([
    prisma.blog.count(),
    prisma.comment.count({ where: { status: "PENDING" } }),
    prisma.blog.aggregate({
      _sum: {
        viewCount: true,
      },
    }),
  ]);

  return {
    blogCount,
    pendingCommentCount,
    totalViews: totalViews._sum.viewCount || 0,
  };
}

export async function getAllBlogs() {
  return await prisma.blog.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      viewCount: true,
      publishedAt: true,
      createdAt: true,
    },
  });
}
