export function createErrorResponse(error: string, details?: string, status = 500): Response {
  return new Response(
    JSON.stringify({
      error,
      ...(details && { details }),
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export function createSuccessResponse(data: any): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export function createDataUriResponse(dataUri: string, contentType: string): Response {
  return new Response(dataUri, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": dataUri.length.toString(),
      "Cache-Control": "no-cache",
    },
  });
}
