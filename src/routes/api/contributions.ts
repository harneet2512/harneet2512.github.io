import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { corsJson, preflight } from "@/lib/cors";

const GITHUB_USERNAME = "harneet2512";
const CACHE_TTL = 3600_000; // 1 hour

let cached: { data: unknown; ts: number } | null = null;

export const Route = createFileRoute("/api/contributions")({
  server: {
    handlers: {
      OPTIONS: ({ request }: { request: Request }) => preflight(request),
      GET: async ({ request }: { request: Request }) => {
        if (cached && Date.now() - cached.ts < CACHE_TTL) {
          return corsJson(cached.data, request);
        }

        const token = process.env.GITHUB_TOKEN;
        const query = `query {
          user(login: "${GITHUB_USERNAME}") {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }`;

        try {
          const res = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ query }),
          });

          if (!res.ok) return corsJson({ weeks: [], total: 0 }, request);

          const json = (await res.json()) as {
            data?: {
              user?: {
                contributionsCollection?: {
                  contributionCalendar?: {
                    totalContributions: number;
                    weeks: { contributionDays: { contributionCount: number; date: string }[] }[];
                  };
                };
              };
            };
          };

          const cal = json.data?.user?.contributionsCollection?.contributionCalendar;
          if (!cal) return corsJson({ weeks: [], total: 0 }, request);

          const weeks = cal.weeks
            .slice(-20)
            .map((w) => w.contributionDays.map((d) => d.contributionCount));

          const data = { weeks, total: cal.totalContributions };
          cached = { data, ts: Date.now() };
          return corsJson(data, request);
        } catch {
          return corsJson({ weeks: [], total: 0 }, request);
        }
      },
    },
  },
});
