import "dotenv/config";

// Array of different Web Browser User-Agents to avoid blocking
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
];

// Function to get random User-Agent
function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// Function to try API call with different User-Agents
async function tryApiCallWithDifferentUserAgents(
  url: string,
  requestBody: any,
  apiKey: string
): Promise<Response> {
  let lastError: any = null;

  for (let i = 0; i < USER_AGENTS.length; i++) {
    const userAgent = USER_AGENTS[i];
    console.log(
      `Trying with User-Agent ${i + 1}/${
        USER_AGENTS.length
      }: ${userAgent.substring(0, 50)}...`
    );

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
        console.log(
          `Success with User-Agent ${i + 1}: ${userAgent.substring(0, 50)}...`
        );
        return response;
      }

      const errorData = await response.json();
      console.log(
        `Failed with User-Agent ${i + 1}: ${
          errorData.error?.message || "Unknown error"
        }`
      );

      // If it's not a billing/quota error, return immediately
      if (
        !errorData.error?.message?.includes("billing") &&
        !errorData.error?.message?.includes("quota") &&
        !errorData.error?.message?.includes("limit")
      ) {
        throw new Error(JSON.stringify(errorData));
      }

      lastError = errorData;

      // Wait a bit before trying next User-Agent
      if (i < USER_AGENTS.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (fetchError) {
      console.log(`Network error with User-Agent ${i + 1}: ${fetchError}`);
      lastError = fetchError;

      // Wait a bit before trying next User-Agent
      if (i < USER_AGENTS.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  // If all User-Agents failed, throw the last error
  throw lastError;
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Invalid prompt" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Use environment variable with fallback
    const apiKey =
      process.env.OPENAI_API_KEY ||
      "sk-TZ9LBaW8Urore8R3nJTEAAevY5KLqJBOG2XmRWzMsfbZRMF0";

    console.log("Using API key:", apiKey.substring(0, 10) + "...");
    console.log(
      "Environment OPENAI_API_KEY:",
      process.env.OPENAI_API_KEY ? "Found" : "Not found"
    );

    const requestBody = {
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    };

    console.log("Request body:", JSON.stringify(requestBody, null, 2));
    console.log("Request headers:", {
      "Content-Type": "application/json",
      Authorization: apiKey.substring(0, 10) + "...",
    });

    // Try API call with different User-Agents
    let response: Response;
    try {
      response = await tryApiCallWithDifferentUserAgents(
        "https://api.takey.ai/v1/images/generations",
        requestBody,
        apiKey
      );
    } catch (apiError) {
      console.error("All User-Agents failed:", apiError);

      // Parse error if it's a JSON string
      let errorDetails = "Unknown error";
      if (typeof apiError === "string") {
        try {
          const parsedError = JSON.parse(apiError);
          errorDetails = parsedError.error?.message || errorDetails;
        } catch {
          errorDetails = apiError;
        }
      } else if (
        apiError &&
        typeof apiError === "object" &&
        "error" in apiError
      ) {
        const errorObj = apiError as { error?: { message?: string } };
        errorDetails = errorObj.error?.message || errorDetails;
      } else if (apiError instanceof Error) {
        errorDetails = apiError.message;
      }

      return new Response(
        JSON.stringify({
          error: "Failed to generate image with all User-Agents",
          details: errorDetails,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await response.json();

    // Validate response structure
    if (
      !result.data ||
      !Array.isArray(result.data) ||
      result.data.length === 0
    ) {
      console.error("Invalid API response structure:", result);
      return new Response(
        JSON.stringify({
          error: "Invalid response from image generation API",
          details: "No image data received",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const imageUrl = result.data[0].url;
    if (!imageUrl) {
      console.error("No image URL in response:", result.data[0]);
      return new Response(
        JSON.stringify({
          error: "No image URL received from API",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Add option to skip base64 conversion for testing
    const skipBase64 = false; // Set to true to test URL fallback

    if (skipBase64) {
      console.log("Skipping base64 conversion, returning URL directly");
      return new Response(
        JSON.stringify({
          success: true,
          url: imageUrl,
          prompt: prompt,
          revised_prompt: result.data[0].revised_prompt || prompt,
          note: "Returned URL directly (base64 conversion skipped)",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    try {
      // Fetch the image and convert to base64
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

      // Get content type to determine image format
      const contentType =
        imageResponse.headers.get("content-type") || "image/png";
      const imageBuffer = await imageResponse.arrayBuffer();

      // Validate buffer size
      if (imageBuffer.byteLength === 0) {
        throw new Error("Received empty image buffer");
      }

      console.log(`Image buffer size: ${imageBuffer.byteLength} bytes`);
      console.log(`Content-Type: ${contentType}`);

      const base64Image = Buffer.from(imageBuffer).toString("base64");

      // Validate base64 string
      if (!base64Image || base64Image.length < 100) {
        throw new Error("Invalid or too short base64 string");
      }

      // Validate base64 format (should only contain valid base64 characters)
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(base64Image)) {
        throw new Error("Invalid base64 format detected");
      }

      console.log(`Base64 length: ${base64Image.length} characters`);
      console.log(`Base64 preview: ${base64Image.substring(0, 100)}...`);

      // Clean base64 string (remove any potential whitespace or invalid characters)
      const cleanBase64 = base64Image.replace(/[^A-Za-z0-9+/=]/g, "");

      // Double check the cleaned base64
      if (cleanBase64.length !== base64Image.length) {
        console.log(
          `Cleaned base64, removed ${
            base64Image.length - cleanBase64.length
          } invalid characters`
        );
      }

      // Create data URI
      const dataUri = `data:${contentType};base64,${cleanBase64}`;

      console.log(`Final data URI length: ${dataUri.length} characters`);
      console.log(`Data URI preview: ${dataUri.substring(0, 100)}...`);

      // Return as Vercel SDK format with correct content type
      return new Response(dataUri, {
        headers: {
          "Content-Type": contentType,
          "Content-Length": dataUri.length.toString(),
          "Cache-Control": "no-cache",
        },
      });
    } catch (imageError) {
      console.error("Error processing image:", imageError);

      // Fallback: Return JSON with URL instead of trying to convert to base64
      console.log(
        "Falling back to URL response due to base64 conversion error"
      );
      return new Response(
        JSON.stringify({
          success: true,
          url: imageUrl,
          prompt: prompt,
          revised_prompt: result.data[0].revised_prompt || prompt,
          note: "Returned URL instead of base64 due to conversion error",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Image generation API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
