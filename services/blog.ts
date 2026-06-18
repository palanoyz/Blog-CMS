import { prisma } from "@/lib/db";
import { BlogStatus } from "@/app/generated/prisma/enums";

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
    deletedAt: null,
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
  return await prisma.blog.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      deletedAt: null,
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
    prisma.blog.count({ where: { deletedAt: null } }),
    prisma.comment.count({ where: { status: "PENDING" } }),
    prisma.blog.aggregate({
      _sum: {
        viewCount: true,
      },
      where: { deletedAt: null },
    }),
  ]);

  return {
    blogCount,
    pendingCommentCount,
    totalViews: totalViews._sum.viewCount || 0,
  };
}

export async function getAllBlogs({ showDeletedOnly = false }: { showDeletedOnly?: boolean } = {}) {
  return await prisma.blog.findMany({
    where: {
      deletedAt: showDeletedOnly ? { not: null } : null,
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

export async function createBlog(data: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: "DRAFT" | "PUBLISHED" | "UNPUBLISHED";
  images?: string[];
}) {
  const { images, ...blogData } = data;

  return await prisma.$transaction(async (tx) => {
    const blog = await tx.blog.create({
      data: {
        ...blogData,
        publishedAt: blogData.status === "PUBLISHED" ? new Date() : null,
        images: images && images.length > 0
          ? {
            create: images.map((url) => ({ imageUrl: url })),
          }
          : undefined,
      },
    });

    return blog;
  });
}

export async function deleteBlog(id: string) {
  return await prisma.blog.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
}

export async function restoreBlog(id: string) {
  return await prisma.blog.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  });
}

export async function getBlogById(id: string) {
  return await prisma.blog.findUnique({
    where: { id },
    include: {
      images: {
        select: {
          id: true,
          imageUrl: true,
        },
      },
    },
  });
}

export async function updateBlog(
  id: string,
  data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    status: "DRAFT" | "PUBLISHED" | "UNPUBLISHED";
    images?: string[];
  }
) {
  const { images, ...blogData } = data;

  return await prisma.$transaction(async (tx) => {
    const blog = await tx.blog.update({
      where: { id },
      data: {
        ...blogData,
        publishedAt: blogData.status === "PUBLISHED" ? new Date() : null,
      },
    });

    await tx.blogImage.deleteMany({
      where: { blogId: id },
    });

    if (images && images.length > 0) {
      await tx.blogImage.createMany({
        data: images.map((url) => ({
          blogId: id,
          imageUrl: url,
        })),
      });
    }

    return blog;
  });
}

