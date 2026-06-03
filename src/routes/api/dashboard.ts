import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { getStats } from "@/lib/analytics-store";

export const Route = createFileRoute("/api/dashboard")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(getStats());
      },
    },
  },
});
