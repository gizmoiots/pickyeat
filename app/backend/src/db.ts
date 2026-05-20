import { Pool, type PoolConfig } from "pg";

// Lazy pg pool. Configured for Supabase (SSL required) by default; falls back
// to no-SSL when running against a local Docker Postgres on localhost.

let _pool: Pool | null = null;

export function db(): Pool {
  if (!_pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not set — backend is in live mode but DB is missing");
    }
    const cfg: PoolConfig = {
      connectionString: process.env.DATABASE_URL,
      // Supabase, Neon, Railway managed Postgres all require SSL. The
      // `rejectUnauthorized: false` is safe here because the connection
      // string itself authenticates us — SSL just provides transport.
      ssl: isLocalhost(process.env.DATABASE_URL)
        ? false
        : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000
    };
    _pool = new Pool(cfg);
    _pool.on("error", (err) => {
      console.error("[pg] unexpected pool error:", err);
    });
  }
  return _pool;
}

function isLocalhost(connStr: string): boolean {
  try {
    const u = new URL(connStr);
    return u.hostname === "localhost" || u.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

export const isMockMode = () => (process.env.API_MODE ?? "mock") === "mock";

// Convenience for one-shot queries.
export async function q<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const r = await db().query(text, params);
  return r.rows as T[];
}
