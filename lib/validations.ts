import { z } from "zod";

export const BlogStatusSchema = z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED"]);
export const CommentStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);

export const BlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.url("Invalid cover image URL"),
  status: BlogStatusSchema.default("DRAFT"),
});
  
export const BlogImageSchema = z.object({
  imageUrl: z.url("Invalid image URL"),
});

export const CommentSchema = z.object({
  senderName: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .regex(/^[ก-๙0-9\s]+$/, "Message must contain only Thai characters, numbers, and spaces"),
  blogId: z.uuid("Invalid blog ID"),
});

export type BlogInput = z.infer<typeof BlogSchema>;
export type BlogImageInput = z.infer<typeof BlogImageSchema>;
export type CommentInput = z.infer<typeof CommentSchema>;
