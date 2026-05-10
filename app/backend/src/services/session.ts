// Session token wrapper. Issues + verifies opaque tokens that map to user_id.
// MVP uses crypto-random tokens + an in-memory map. Production: signed JWTs.

import { randomBytes } from "node:crypto";

const sessions = new Map<string, { userId: string; createdAt: number; expiresAt: number }>();
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function issueToken(userId: string): string {
  const token = randomBytes(24).toString("hex");
  sessions.set(token, { userId, createdAt: Date.now(), expiresAt: Date.now() + TTL_MS });
  return token;
}

export function verifyToken(token: string | undefined): string | null {
  if (!token) return null;
  const entry = sessions.get(token);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return entry.userId;
}

export function revokeToken(token: string): void {
  sessions.delete(token);
}
