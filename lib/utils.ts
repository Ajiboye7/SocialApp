import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
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
