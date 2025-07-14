import { USER_AGENTS } from "@/constants/userAgents";
import { API_CONFIG } from "@/constants/apiConfig";

interface ApiCallOptions {
  url: string;
  requestBody: any;
  apiKey: string;
}

export async function tryApiCallWithDifferentUserAgents({
  url,
  requestBody,
  apiKey,
}: ApiCallOptions): Promise<Response> {
  let lastError: any = null;

  for (let i = 0; i < USER_AGENTS.length; i++) {
    const userAgent = USER_AGENTS[i];

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
          "User-Agent": userAgent,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        return response;
      }

      const errorData = await response.json();

      if (
        !errorData.error?.message?.includes("billing") &&
        !errorData.error?.message?.includes("quota") &&
        !errorData.error?.message?.includes("limit")
      ) {
        throw new Error(JSON.stringify(errorData));
      }

      lastError = errorData;

      if (i < USER_AGENTS.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, API_CONFIG.RETRY.DELAY));
      }
    } catch (fetchError) {
      lastError = fetchError;

      if (i < USER_AGENTS.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, API_CONFIG.RETRY.DELAY));
      }
    }
  }

  throw lastError;
}

export function parseApiError(apiError: any): string {
  if (typeof apiError === "string") {
    try {
      const parsedError = JSON.parse(apiError);
      return parsedError.error?.message || apiError;
    } catch {
      return apiError;
    }
  }

  if (apiError && typeof apiError === "object" && "error" in apiError) {
    const errorObj = apiError as { error?: { message?: string } };
    return errorObj.error?.message || "Unknown error";
  }

  if (apiError instanceof Error) {
    return apiError.message;
  }

  return "Unknown error";
}
