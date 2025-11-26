import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
}

export async function uploadImageToUploadThing(imageUrl: string): Promise<string> {
  try {
    // Fetch the image from Clerk CDN
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'organization-image.jpg', { type: blob.type });

    // Upload to UploadThing
    const formData = new FormData();
    formData.append('files', file);

    const uploadResponse = await fetch('/api/uploadthing', {
      method: 'POST',
      body: formData,
    });

    const result = await uploadResponse.json();
    
    if (result && result[0]?.ufsUrl) {
      return result[0].ufsUrl;
    }
    
    throw new Error('Upload failed');
  } catch (error) {
    console.error('UploadThing upload failed:', error);
    return '';
  }
}

export async function imageUrlToBase64(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Image fetch failed");

    const buffer = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get("content-type") || "image/png";

    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch (err) {
    console.error("Failed to convert image:", err);
    return ""; // fallback
  }
}

