import "dotenv/config";
import { API_CONFIG } from "@/constants/apiConfig";
import { tryApiCallWithDifferentUserAgents, parseApiError } from "@/utils/apiClient";
import { convertImageToBase64, validateApiResponse } from "@/utils/imageProcessor";
import { createErrorResponse, createSuccessResponse, createDataUriResponse } from "@/utils/responseHelpers";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return createErrorResponse("Invalid prompt", undefined, 400);
    }

    const apiKey = process.env.OPENAI_API_KEY || "sk-TZ9LBaW8Urore8R3nJTEAAevY5KLqJBOG2XmRWzMsfbZRMF0";

    const requestBody = {
      model: API_CONFIG.IMAGE_GENERATION.MODEL,
      prompt,
      n: API_CONFIG.IMAGE_GENERATION.COUNT,
      size: API_CONFIG.IMAGE_GENERATION.SIZE,
    };

    let response: Response;
    try {
      response = await tryApiCallWithDifferentUserAgents({
        url: API_CONFIG.IMAGE_GENERATION.URL,
        requestBody,
        apiKey,
      });
    } catch (apiError) {
      const errorDetails = parseApiError(apiError);
      return createErrorResponse(
        "Failed to generate image with all User-Agents",
        errorDetails
      );
    }

    const result = await response.json();

    try {
      validateApiResponse(result);
    } catch (validationError) {
      return createErrorResponse(
        "Invalid response from image generation API",
        validationError instanceof Error ? validationError.message : "No image data received"
      );
    }

    const imageUrl = result.data[0].url;

    try {
      const dataUri = await convertImageToBase64(imageUrl);
      const contentType = dataUri.split(';')[0].split(':')[1];
      return createDataUriResponse(dataUri, contentType);
    } catch (imageError) {
      return createSuccessResponse({
        success: true,
        url: imageUrl,
        prompt: prompt,
        revised_prompt: result.data[0].revised_prompt || prompt,
        note: "Returned URL instead of base64 due to conversion error",
      });
    }
  } catch (error) {
    return createErrorResponse(
      "Failed to generate image",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
