"use server";
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { createBlog, deleteBlog, updateBlog, restoreBlog } from "@/services/blog";
import { BlogSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { z } from "zod";

export async function createBlogAction(formData: any) {
  const validatedFields = BlogSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: z.treeifyError(validatedFields.error),
    };
  }

  // Check if slug is unique
  const existingBlog = await prisma.blog.findUnique({
    where: { slug: validatedFields.data.slug },
  });

  if (existingBlog) {
    return {
      error: { properties: { slug: { errors: ["This slug is already in use."] } } } as any,
    };
  }

  try {
    await createBlog(validatedFields.data as any);
  } catch (error) {
    console.error("Error creating blog:", error);
    return {
      error: { errors: ["Failed to create blog. Please try again later."] } as any,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/blogs");
  redirect("/admin/blogs");
}

export async function deleteBlogAction(id: string) {
  try {
    await deleteBlog(id);
    revalidatePath("/");
    revalidatePath("/admin/blogs");
    return { success: true };
  } catch (error) {
    console.error("Error deleting blog:", error);
    return { error: "Failed to delete blog." };
  }
}

export async function updateBlogAction(id: string, formData: any) {
  const validatedFields = BlogSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: z.treeifyError(validatedFields.error),
    };
  }

  // Check if slug is unique
  const existingBlog = await prisma.blog.findFirst({
    where: {
      slug: validatedFields.data.slug,
      id: { not: id },
    },
  });

  if (existingBlog) {
    return {
      error: { properties: { slug: { errors: ["This slug is already in use."] } } } as any,
    };
  }

  try {
    await updateBlog(id, validatedFields.data as any);
  } catch (error) {
    console.error("Error updating blog:", error);
    return {
      error: { errors: ["Failed to update blog. Please try again later."] } as any,
    };
  }

  revalidatePath("/");
  revalidatePath(`/blog/${validatedFields.data.slug}`);
  revalidatePath("/admin/blogs");
  redirect("/admin/blogs");
}

export async function restoreBlogAction(id: string) {
  try {
    await restoreBlog(id);
    revalidatePath("/");
    revalidatePath("/admin/blogs");
    return { success: true };
  } catch (error) {
    console.error("Error restoring blog:", error);
    return { error: "Failed to restore blog." };
  }
}


