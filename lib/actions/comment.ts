"use server";

import { prisma } from "@/lib/db";
import { CommentSchema } from "@/lib/validations";

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
    await prisma.comment.create({
      data: {
        senderName: validatedFields.data.senderName,
        message: validatedFields.data.message,
        blogId: validatedFields.data.blogId,
        status: "PENDING",
      },
    });

    // Revalidate the blog page to show the new comment (though it's pending, 
    // we want to ensure cache is fresh for when it is approved)
    // Actually, since it's pending, it won't show up yet.

    return { success: true };
  } catch (error) {
    console.error("Error submitting comment:", error);
    return {
      error: { _form: ["Failed to submit comment. Please try again later."] },
    };
  }
}
