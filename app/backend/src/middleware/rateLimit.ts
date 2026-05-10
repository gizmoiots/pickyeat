// Express middleware that rate-limits the expensive endpoints.
// Anonymous: 5 scans + 20 recommends per hour per IP.
// Signed-in: 30 scans + 120 recommends per hour per user.
//
// Disabled in mock mode (returns a no-op middleware) so dev/test isn't gated.

import type { RequestHandler } from "express";
import { isMockMode } from "../db.js";

type LimitConfig = { windowMs: number; max: number };

const buckets = new Map<string, { count: number; resetAt: number }>();

// Manual in-memory limiter — no dep. For production at scale, swap for
// express-rate-limit + Redis store. Keeping this dep-free for the MVP.
export function rateLimit(name: string, config: LimitConfig): RequestHandler {
  if (isMockMode()) return (_, __, next) => next();

  return (req, res, next) => {
    const userId = (req.headers["x-user-id"] as string) ?? null;
    const key = `${name}:${userId ?? req.ip}`;
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt < now) {
      buckets.set(key, { count: 1, resetAt: now + config.windowMs });
      return next();
    }

    if (bucket.count >= config.max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      res.status(429).json({
        error: "rate_limited",
        message:
          userId
            ? `Slow down — ${config.max} per hour. Try again in ${Math.ceil(retryAfter / 60)} min.`
            : `Sign in to scan more. Anonymous limit is ${config.max} per hour.`,
        retryAfterSec: retryAfter
      });
      return;
    }

    bucket.count++;
    next();
  };
}

// Periodic cleanup so the map doesn't grow forever.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}, 60_000).unref?.();
