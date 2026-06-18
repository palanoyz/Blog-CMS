"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { uploadImage } from "@/lib/upload";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  folder: "covers" | "gallery";
  onUploadComplete: (url: string) => void;
  disabled?: boolean;
}

export function ImageUploader({
  folder,
  onUploadComplete,
  disabled,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onUploadComplete(url);
      toast.success("Image uploaded and compressed successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-4">
      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className="sr-only"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || isUploading}
          className="pointer-events-none"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </label>
    </div>
  );
}
