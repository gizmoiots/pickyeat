import { Pool } from "pg";

// Lazy pool — only created if DATABASE_URL is set. In mock mode the routes
// short-circuit before touching this.

let _pool: Pool | null = null;

export function db(): Pool {
  if (!_pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not set — backend is in live mode but DB is missing");
    }
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return _pool;
}

export const isMockMode = () => (process.env.API_MODE ?? "mock") === "mock";
