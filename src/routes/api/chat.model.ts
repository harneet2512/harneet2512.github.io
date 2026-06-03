import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { getFreeModels } from "@/lib/ai-gateway";

export const Route = createFileRoute("/api/chat/model")({
  server: {
    handlers: {
      GET: async () => {
        const key = process.env.OPENROUTER_API_KEY;
        if (!key) return Response.json({ model: "unavailable" });
        const models = await getFreeModels(key);
        return Response.json({
          model: models[0].replace(/:free$/, ""),
          fallbacks: models.slice(1).map((m) => m.replace(/:free$/, "")),
          routing: "auto",
        });
      },
    },
  },
});
