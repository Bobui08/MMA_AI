import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const result = await generateText({
      model: google("gemini-1.5-flash"),
      prompt,
      system:
        "You are a helpful assistant that can answer questions and help with tasks.",
    });

    return new Response(result.text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
