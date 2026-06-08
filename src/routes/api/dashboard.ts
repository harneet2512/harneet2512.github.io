import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { getStats } from "@/lib/analytics-store";
import { corsJson, preflight } from "@/lib/cors";

export const Route = createFileRoute("/api/dashboard")({
  server: {
    handlers: {
      OPTIONS: ({ request }: { request: Request }) => preflight(request),
      GET: async ({ request }: { request: Request }) => {
        return corsJson(await getStats(), request);
      },
    },
  },
});
