/**
 * Base URL for the backend API.
 *
 * - Empty string = same origin. This is the case in local dev and on the
 *   Vercel deployment (where the API lives alongside the app).
 * - On the static github.io build, `VITE_API_BASE` is set at build time to the
 *   Vercel API origin so the static frontend can call the serverless backend
 *   cross-origin. The site itself stays on harneet2512.github.io.
 */
export const API_BASE: string =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? "";

export const apiUrl = (path: string): string => `${API_BASE}${path}`;
