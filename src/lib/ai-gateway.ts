import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const PREFERRED = [
  "nvidia/nemotron-3-super-120b-a12b:free",
  "google/gemma-4-31b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "moonshotai/kimi-k2.6:free",
];

let cachedModels: string[] | null = null;
let cacheTs = 0;
const CACHE_TTL = 60 * 60 * 1000;

async function fetchFreeModels(apiKey: string): Promise<string[]> {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) return PREFERRED.slice(0, 3);
    const data = (await res.json()) as { data?: { id: string; context_length?: number }[] };
    const free = (data.data ?? [])
      .filter((m) => m.id.endsWith(":free") && (m.context_length ?? 0) >= 32000)
      .map((m) => m.id);
    const ordered = PREFERRED.filter((p) => free.includes(p));
    const rest = free.filter((f) => !ordered.includes(f)).slice(0, 5);
    return [...ordered, ...rest].slice(0, 3);
  } catch {
    return PREFERRED.slice(0, 3);
  }
}

export async function getFreeModels(apiKey: string): Promise<string[]> {
  const now = Date.now();
  if (cachedModels && now - cacheTs < CACHE_TTL) return cachedModels;
  cachedModels = await fetchFreeModels(apiKey);
  cacheTs = now;
  return cachedModels;
}

export const FREE_MODELS = PREFERRED.slice(0, 3);

export const createChatProvider = (apiKey: string) =>
  createOpenAICompatible({
    name: "openrouter",
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    headers: {
      "HTTP-Referer": "https://harneet2512.github.io",
      "X-Title": "Harneet Bali - Workbench",
    },
  });

export const CHAT_MODEL = FREE_MODELS[0];
