"use server";

import { prisma } from "@/lib/db";
import { CommentSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function submitComment(formData: {
  senderName: string;
  message: string;
  blogId: string;
}) {
  const validatedFields = CommentSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        senderName: validatedFields.data.senderName,
        message: validatedFields.data.message,
        blogId: validatedFields.data.blogId,
        status: "PENDING",
      },
      include: {
        blog: {
          select: { slug: true }
        }
      }
    });

    revalidatePath(`/blog/${newComment.blog.slug}`);
    revalidatePath(`/admin/comments`);
    revalidatePath(`/admin`);

    return { success: true };
  } catch (error) {
    console.error("Error submitting comment:", error);
    return {
      error: { _form: ["Failed to submit comment. Please try again later."] },
    };
  }
}

export async function approveComment(commentId: string) {
  try {
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { status: "APPROVED" },
      include: {
        blog: {
          select: { slug: true }
        }
      }
    });

    revalidatePath(`/blog/${comment.blog.slug}`);
    revalidatePath(`/admin/comments`);
    revalidatePath(`/admin`);

    return { success: true };
  } catch (error) {
    console.error("Error approving comment:", error);
    return { error: "Failed to approve comment." };
  }
}

export async function rejectComment(commentId: string) {
  try {
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { status: "REJECTED" },
      include: {
        blog: {
          select: { slug: true }
        }
      }
    });

    revalidatePath(`/blog/${comment.blog.slug}`);
    revalidatePath(`/admin/comments`);
    revalidatePath(`/admin`);

    return { success: true };
  } catch (error) {
    console.error("Error rejecting comment:", error);
    return { error: "Failed to reject comment." };
  }
}

