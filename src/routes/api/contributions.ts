import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";

const GITHUB_USERNAME = "harneet2512";
const CACHE_TTL = 3600_000; // 1 hour

let cached: { data: unknown; ts: number } | null = null;

export const Route = createFileRoute("/api/contributions")({
  server: {
    handlers: {
      GET: async () => {
        if (cached && Date.now() - cached.ts < CACHE_TTL) {
          return Response.json(cached.data);
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

          if (!res.ok) return Response.json({ weeks: [], total: 0 });

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
          if (!cal) return Response.json({ weeks: [], total: 0 });

          const weeks = cal.weeks
            .slice(-20)
            .map((w) => w.contributionDays.map((d) => d.contributionCount));

          const data = { weeks, total: cal.totalContributions };
          cached = { data, ts: Date.now() };
          return Response.json(data);
        } catch {
          return Response.json({ weeks: [], total: 0 });
        }
      },
    },
  },
});
