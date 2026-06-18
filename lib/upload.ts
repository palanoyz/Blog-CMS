import { supabase } from "@/lib/supabase";

export async function compressImage(
  file: File,
  maxW = 1200,
  maxH = 1200,
  quality = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxW) {
            height = Math.round((height * maxW) / width);
            width = maxW;
          }
        } else {
          if (height > maxH) {
            width = Math.round((width * maxH) / height);
            height = maxH;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Could not get canvas context"));

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas compression failed"));
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export async function uploadImage(
  file: File,
  folder: "covers" | "gallery"
): Promise<string> {
  // Validate file size (5MB maximum)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size exceeds the 5 MB limit.");
  }

  // Validate format
  const allowedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedFormats.includes(file.type)) {
    throw new Error("Invalid image format. Supported formats: jpg, jpeg, png, webp");
  }

  // Compress
  const compressedBlob = await compressImage(file);
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.jpg`;
  const filePath = `${folder}/${fileName}`;

  // Upload to Supabase Storage bucket
  const { error } = await supabase.storage
    .from("blog-bucket")
    .upload(filePath, compressedBlob, {
      contentType: "image/jpeg",
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data: urlData } = supabase.storage
    .from("blog-bucket")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
