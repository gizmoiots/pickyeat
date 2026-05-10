import { Router } from "express";
import { isMockMode, db } from "../db.js";
import { cafeMocha, dishes } from "../mockData.js";

// /api/owner/* — restaurant-owner endpoints.
// Auth via Bearer token from /api/owner/otp/verify.

export const ownerRouter = Router();

// ── auth ─────────────────────────────────────────────────────────────
ownerRouter.post("/otp/request", (req, res) => {
  const { phone } = req.body ?? {};
  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: "phone must be 10 digits" });
  }

  if (isMockMode()) {
    console.log(`[mock owner] OTP for +91 ${phone} → 424242`);
    return res.json({ ok: true, devOtp: "424242" });
  }

  // TODO: send via MSG91 — same wrapper as user auth, different template ID
  return res.status(501).json({ error: "msg91 not wired" });
});

ownerRouter.post("/otp/verify", (req, res) => {
  const { phone, otp } = req.body ?? {};
  if (!phone || !otp) return res.status(400).json({ error: "phone+otp required" });

  if (isMockMode()) {
    if (otp !== "424242") return res.status(401).json({ error: "wrong otp" });
    return res.json({
      token: `owner_demo_${phone}`,
      ownerId: "owner_demo_aarav",
      restaurantId: cafeMocha.id
    });
  }

  return res.status(501).json({ error: "msg91 verify not wired" });
});

// ── dashboard ────────────────────────────────────────────────────────
ownerRouter.get("/dashboard", (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "no token" });

  if (isMockMode()) {
    return res.json({
      restaurant: {
        id: cafeMocha.id,
        name: cafeMocha.name,
        address: cafeMocha.address,
        tier: "claimed"
      },
      scansThisMonth: 47,
      topPickedDishes: [
        { name: "Butter chicken", pickCount: 18, orderRate: 72 },
        { name: "Paneer tikka masala", pickCount: 12, orderRate: 64 },
        { name: "Dal makhani", pickCount: 9, orderRate: 55 },
        { name: "Garlic naan", pickCount: 7, orderRate: 48 },
        { name: "Mango lassi", pickCount: 5, orderRate: 60 }
      ],
      dietaryMix: { veg: 18, nonveg: 26, vegan: 3 },
      recentFeedback: [
        {
          dishName: "Butter chicken",
          rating: "loved it",
          notes: "Best I've had in Pune. Will be back.",
          when: "2 hours ago"
        },
        {
          dishName: "Paneer tikka masala",
          rating: "fine",
          notes: "Could use a touch more salt.",
          when: "yesterday"
        },
        {
          dishName: "Garlic naan",
          rating: "loved it",
          when: "yesterday"
        }
      ]
    });
  }

  // Real impl — query scans + feedback aggregated by restaurant_id from
  // the owner's restaurant_owners row.
  return res.status(501).json({ error: "owner dashboard live mode not wired" });
});

// ── menu editor (Tier 1+) ────────────────────────────────────────────
ownerRouter.get("/menu", (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "no token" });
  if (isMockMode()) return res.json({ dishes });
  return res.status(501).json({ error: "menu live mode not wired" });
});

ownerRouter.put("/menu/:dishId", (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "no token" });
  if (isMockMode()) {
    return res.json({ ok: true, dishId: req.params.dishId, updated: req.body });
  }
  return res.status(501).json({ error: "menu update live mode not wired" });
});

ownerRouter.post("/specials", (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "no token" });
  if (isMockMode()) {
    return res.json({
      id: `spec_${Date.now()}`,
      ...req.body,
      activeUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
  }
  return res.status(501).json({ error: "specials live mode not wired" });
});

// ── upgrade (Tier 2+) ────────────────────────────────────────────────
ownerRouter.post("/upgrade", (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "no token" });
  const { toTier } = req.body ?? {};
  if (!["featured", "xenios"].includes(toTier)) {
    return res.status(400).json({ error: "invalid tier" });
  }

  if (isMockMode()) {
    return res.json({
      ok: true,
      checkoutUrl: `https://rzp.io/i/demo_${toTier}` // real Razorpay link in live mode
    });
  }
  return res.status(501).json({ error: "razorpay not wired" });
});
