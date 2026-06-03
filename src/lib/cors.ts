/**
 * CORS for the API routes. The static frontend is served from
 * harneet2512.github.io and calls this API on Vercel cross-origin, so every
 * API response must carry CORS headers and preflight (OPTIONS) must be answered.
 */
const ALLOWED_ORIGINS = new Set([
  "https://harneet2512.github.io",
  "http://localhost:8080",
  "http://localhost:3000",
]);

const DEFAULT_ORIGIN = "https://harneet2512.github.io";

export function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : DEFAULT_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Expose-Headers": "x-model",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

/** Answer a CORS preflight request. */
export function preflight(request: Request): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("origin")),
  });
}

/** Merge CORS headers into an existing Response (e.g. a streaming response). */
export function withCors(response: Response, request: Request): Response {
  const headers = corsHeaders(request.headers.get("origin"));
  for (const [k, v] of Object.entries(headers)) response.headers.set(k, v);
  return response;
}

/** Build a JSON Response that already carries CORS headers. */
export function corsJson(data: unknown, request: Request, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(request.headers.get("origin")),
      ...(init?.headers ?? {}),
    },
  });
}
