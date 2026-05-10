import { Router } from "express";
import express from "express";
import { isMockMode } from "../db.js";
import { verifyToken } from "../services/session.js";
import {
  createSubscription,
  cancelSubscription,
  verifyWebhookSignature,
  type PlanKey
} from "../services/razorpay.js";
import { captureError } from "../sentry.js";

// POST /api/billing/subscribe   { plan: "monthly" | "yearly" }   → checkoutUrl
// POST /api/billing/cancel                                       → ok
// POST /api/billing/webhook     (Razorpay → us; signature-verified)
// GET  /api/billing/status                                       → tier + premium_until

export const billingRouter = Router();

billingRouter.post("/subscribe", async (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const userId = verifyToken(token);
  if (!userId) return res.status(401).json({ error: "sign in first" });

  const plan = req.body?.plan as PlanKey;
  if (!plan || !["monthly", "yearly"].includes(plan)) {
    return res.status(400).json({ error: "plan must be monthly|yearly" });
  }

  try {
    const sub = await createSubscription(userId, plan);
    return res.json(sub);
  } catch (e) {
    captureError(e, { userId, plan });
    return res.status(500).json({ error: "subscribe_failed" });
  }
});

billingRouter.post("/cancel", async (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const userId = verifyToken(token);
  if (!userId) return res.status(401).json({ error: "sign in first" });

  const { subscriptionId } = req.body ?? {};
  if (!subscriptionId) return res.status(400).json({ error: "subscriptionId required" });

  try {
    await cancelSubscription(subscriptionId);
    return res.json({ ok: true });
  } catch (e) {
    captureError(e, { userId });
    return res.status(500).json({ error: "cancel_failed" });
  }
});

// Razorpay webhook. Needs the raw body for signature verification, so we
// register a body-parsing middleware specific to this route.
billingRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["x-razorpay-signature"] as string | undefined;
    if (!sig) return res.status(400).json({ error: "missing signature" });

    const raw = req.body.toString("utf8");
    if (!verifyWebhookSignature(raw, sig)) {
      return res.status(401).json({ error: "bad signature" });
    }

    const event = JSON.parse(raw);
    console.log("[razorpay webhook]", event.event, event.payload?.subscription?.entity?.id);

    // Real impl — update user.premium_until based on event:
    //   subscription.activated → grant premium_until = end_at
    //   subscription.charged   → extend premium_until
    //   subscription.cancelled → premium_until unchanged (let current period run out)
    //   subscription.completed → no renewal expected, premium_until expires naturally

    return res.json({ ok: true });
  }
);

billingRouter.get("/status", (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const userId = verifyToken(token);
  if (!userId) return res.status(401).json({ error: "sign in first" });

  if (isMockMode()) {
    return res.json({
      tier: "free",
      premiumUntil: null,
      plan: null
    });
  }

  return res.status(501).json({ error: "live billing status not wired" });
});
