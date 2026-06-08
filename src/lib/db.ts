/**
 * Postgres (Neon) connection for persistent analytics.
 *
 * Why this exists: serverless functions are stateless. Every request can land on
 * a different, ephemeral instance, and the filesystem is read-only outside /tmp.
 * An in-memory array or a local JSON file therefore can't be a database — each
 * instance sees only the handful of events it personally recorded, which is why
 * the dashboard only ever showed ~1 event. A shared Postgres table is the single
 * durable place every instance reads from and writes to.
 *
 * Driver: @neondatabase/serverless — HTTP-based, no connection pool to leak
 * across frozen lambdas. The `sql` tagged template runs one query per round-trip.
 *
 * Connection string: Vercel's Neon/Postgres integration injects DATABASE_URL
 * (and POSTGRES_URL). When neither is set (local dev without a DB, or a deploy
 * that hasn't been provisioned yet), `sql` is null and callers fall back to the
 * in-memory store — the site keeps working, it just doesn't persist.
 */
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

const CONNECTION_STRING =
  process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.POSTGRES_PRISMA_URL ?? "";

export const hasDb = CONNECTION_STRING.length > 0;

export const sql: NeonQueryFunction<false, false> | null = hasDb ? neon(CONNECTION_STRING) : null;

// Ensure the schema exists exactly once per instance. The cached promise means
// concurrent requests on a cold instance all await the same CREATE TABLE rather
// than racing to issue it.
let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!sql) return Promise.resolve();
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS analytics_events (
          id          BIGSERIAL PRIMARY KEY,
          ts          TIMESTAMPTZ NOT NULL DEFAULT now(),
          event       TEXT        NOT NULL,
          ip          TEXT,
          source      TEXT,
          country     TEXT,
          city        TEXT,
          device      TEXT,
          os          TEXT,
          browser     TEXT,
          lang        TEXT,
          tz          TEXT,
          screen      TEXT,
          org         TEXT,
          asn         TEXT,
          conn_type   TEXT,
          session_id  TEXT,
          device_id   TEXT,
          duration_ms INTEGER,
          scroll_pct  INTEGER,
          label       TEXT,
          meta        JSONB       NOT NULL DEFAULT '{}'::jsonb
        )
      `;
      // Columns added after the table first shipped — ADD COLUMN IF NOT EXISTS
      // makes ensureSchema an idempotent migration, not just initial creation.
      // ua = raw User-Agent (the most revealing per-visit field), region = state/
      // province from reverse-IP, is_bot = only self-identifying crawlers.
      await sql`
        ALTER TABLE analytics_events
          ADD COLUMN IF NOT EXISTS ua     TEXT,
          ADD COLUMN IF NOT EXISTS region TEXT,
          ADD COLUMN IF NOT EXISTS is_bot BOOLEAN NOT NULL DEFAULT false
      `;
      // ts index powers the timeline GROUP BY and the recent-rows ORDER BY.
      await sql`CREATE INDEX IF NOT EXISTS analytics_events_ts_idx ON analytics_events (ts DESC)`;
    })().catch((err) => {
      // Reset so a later request can retry rather than caching a failed promise.
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}
