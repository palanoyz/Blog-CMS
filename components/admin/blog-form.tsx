"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlogAction } from "@/lib/actions/blog";
import { BlogSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { flattenZodError } from "@/lib/utils";

export function BlogForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED" | "UNPUBLISHED",
    images: [] as string[],
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData({ ...formData, title, slug });
  };

  const handleAddImage = () => {
    if (formData.images.length >= 6) return;
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setErrors({});

    const result = BlogSchema.safeParse(formData);
    if (!result.success) {
      setErrors(flattenZodError(z.treeifyError(result.error)));
      setIsPending(false);
      toast.error("Please fix the errors in the form.");
      return;
    }

    const response = await createBlogAction(formData);

    if (response?.error) {
      setErrors(response.error);
      toast.error("Failed to create blog.");
      setIsPending(false);
    } else {
      toast.success("Blog created successfully!");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-4xl">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="Blog title"
          />
          {errors.title && <p className="text-xs text-red-500">{errors.title[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="blog-slug"
          />
          {errors.slug && <p className="text-xs text-red-500">{errors.slug[0]}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          placeholder="Brief summary of the blog..."
        />
        {errors.excerpt && <p className="text-xs text-red-500">{errors.excerpt[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          rows={10}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Write your blog content here..."
        />
        {errors.content && <p className="text-xs text-red-500">{errors.content[0]}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <Input
            id="coverImage"
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
          {errors.coverImage && <p className="text-xs text-red-500">{errors.coverImage[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status ?? "DRAFT"}
            onValueChange={(value: any) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="UNPUBLISHED">Unpublished</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-xs text-red-500">{errors.status[0]}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Gallery Images (Max 6)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddImage}
            disabled={formData.images.length >= 6}
          >
            <Plus className="h-4 w-4" /> Add Image
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {formData.images.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder="Image URL"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveImage(index)}
                className="text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        {errors.images && <p className="text-xs text-red-500">{errors.images[0]}</p>}
      </div>

      <div className="flex justify-end gap-4 border-t pt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Blog
        </Button>
      </div>
    </form>
  );
}
