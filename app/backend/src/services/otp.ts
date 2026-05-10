// MSG91 wrapper for phone OTP. India-focused, lowest cost per OTP (~₹0.15).
// Stubbed in mock mode; live mode hits the MSG91 REST API.

import { isMockMode } from "../db.js";

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID ?? "PCKYET";

// In-memory store for the demo. Production: Redis with TTL.
const otpStore = new Map<string, { otp: string; expiresAt: number; attempts: number }>();

export async function sendOtp(phone: string): Promise<{ ok: true; devOtp?: string }> {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000, attempts: 0 });

  if (isMockMode() || !MSG91_AUTH_KEY) {
    console.log(`[mock-otp] +91 ${phone} → ${otp}`);
    return { ok: true, devOtp: otp };
  }

  // Live mode — MSG91 Flow API
  const url = `https://api.msg91.com/api/v5/flow/`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authkey: MSG91_AUTH_KEY
    },
    body: JSON.stringify({
      template_id: MSG91_TEMPLATE_ID,
      sender: MSG91_SENDER_ID,
      short_url: "0",
      mobiles: `91${phone}`,
      otp
    })
  });

  if (!res.ok) {
    otpStore.delete(phone);
    throw new Error(`msg91 send failed: ${res.status}`);
  }

  return { ok: true };
}

export function verifyOtp(phone: string, input: string): { ok: boolean; reason?: string } {
  const entry = otpStore.get(phone);
  if (!entry) return { ok: false, reason: "no_otp_sent" };
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(phone);
    return { ok: false, reason: "expired" };
  }
  if (entry.attempts >= 5) {
    otpStore.delete(phone);
    return { ok: false, reason: "too_many_attempts" };
  }
  entry.attempts++;
  if (entry.otp !== input) return { ok: false, reason: "wrong_otp" };

  otpStore.delete(phone); // consume
  return { ok: true };
}

// Periodic cleanup of expired entries.
setInterval(() => {
  const now = Date.now();
  for (const [phone, entry] of otpStore) {
    if (entry.expiresAt < now) otpStore.delete(phone);
  }
}, 60_000).unref?.();
