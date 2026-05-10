import { Router } from "express";
import { isMockMode } from "../db.js";

// POST /api/photo  — uploads a dish photo
//   body: { restaurantId, dishName, imageBase64 }
// Production: upload to S3/R2 and store the key. Auto-moderate via Claude vision
// for faces / inappropriate content before approving.

export const photoRouter = Router();

photoRouter.post("/", (req, res) => {
  const { restaurantId, dishName, imageBase64 } = req.body ?? {};
  if (!restaurantId || !dishName || !imageBase64) {
    return res.status(400).json({ error: "restaurantId, dishName, imageBase64 required" });
  }

  if (isMockMode()) {
    return res.json({
      id: `photo_${Date.now()}`,
      approved: false,
      moderationNote: "queued for review"
    });
  }

  return res.status(501).json({ error: "photo upload live mode not wired" });
});
