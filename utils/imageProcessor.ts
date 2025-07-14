import { API_CONFIG } from "@/constants/apiConfig";
import { getRandomUserAgent } from "./userAgent";

export async function convertImageToBase64(imageUrl: string): Promise<string> {
  const imageResponse = await fetch(imageUrl, {
    headers: {
      "User-Agent": getRandomUserAgent(),
      Accept: "image/*",
    },
  });

  if (!imageResponse.ok) {
    throw new Error(
      `Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`
    );
  }

  const contentType = imageResponse.headers.get("content-type") || "image/png";
  const imageBuffer = await imageResponse.arrayBuffer();

  if (imageBuffer.byteLength === 0) {
    throw new Error("Received empty image buffer");
  }

  const base64Image = Buffer.from(imageBuffer).toString("base64");

  if (!base64Image || base64Image.length < API_CONFIG.VALIDATION.MIN_BASE64_LENGTH) {
    throw new Error("Invalid or too short base64 string");
  }

  if (!API_CONFIG.VALIDATION.BASE64_REGEX.test(base64Image)) {
    throw new Error("Invalid base64 format detected");
  }

  const cleanBase64 = base64Image.replace(/[^A-Za-z0-9+/=]/g, "");
  return `data:${contentType};base64,${cleanBase64}`;
}

export function validateApiResponse(result: any): void {
  if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
    throw new Error("Invalid response from image generation API");
  }

  if (!result.data[0].url) {
    throw new Error("No image URL received from API");
  }
}
