// Razorpay subscription wrapper. ₹49/month or ₹499/year plans.
// Mock-mode returns fake URLs. Live mode uses Razorpay's Subscriptions API.

import { createHmac } from "node:crypto";
import { isMockMode } from "../db.js";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

// Plan IDs created once in the Razorpay dashboard. Use the same string in env.
export const PLAN_IDS = {
  monthly: process.env.RAZORPAY_PLAN_MONTHLY ?? "plan_demo_monthly_49",
  yearly: process.env.RAZORPAY_PLAN_YEARLY ?? "plan_demo_yearly_499"
};

export type PlanKey = keyof typeof PLAN_IDS;

export async function createSubscription(
  userId: string,
  plan: PlanKey
): Promise<{ subscriptionId: string; checkoutUrl: string; shortUrl?: string }> {
  if (isMockMode() || !RAZORPAY_KEY_ID) {
    return {
      subscriptionId: `sub_demo_${Date.now()}`,
      checkoutUrl: `https://rzp.io/i/demo_${plan}`,
      shortUrl: `https://rzp.io/i/demo_${plan}`
    };
  }

  // Live mode — POST https://api.razorpay.com/v1/subscriptions
  // Authenticate with Basic auth (key_id:key_secret base64).
  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
  const r = await fetch("https://api.razorpay.com/v1/subscriptions", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      plan_id: PLAN_IDS[plan],
      customer_notify: 1,
      total_count: plan === "yearly" ? 5 : 60,
      notes: { userId }
    })
  });
  if (!r.ok) throw new Error(`razorpay create failed: ${r.status}`);
  const data = await r.json();
  return {
    subscriptionId: data.id,
    checkoutUrl: data.short_url ?? `https://api.razorpay.com/v1/subscriptions/${data.id}`,
    shortUrl: data.short_url
  };
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  if (isMockMode()) return;
  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
  const r = await fetch(
    `https://api.razorpay.com/v1/subscriptions/${subscriptionId}/cancel`,
    { method: "POST", headers: { Authorization: `Basic ${auth}` } }
  );
  if (!r.ok) throw new Error(`razorpay cancel failed: ${r.status}`);
}

// Webhook signature verification — Razorpay sends X-Razorpay-Signature.
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  if (!RAZORPAY_WEBHOOK_SECRET) return isMockMode(); // dev mode: trust all
  const expected = createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  return expected === signature;
}
