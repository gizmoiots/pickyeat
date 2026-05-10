import { Router } from "express";
import { db, isMockMode } from "../db.js";

// POST /api/feedback
//   body: { scanId, dishId, action, notes? }

export const feedbackRouter = Router();

feedbackRouter.post("/", async (req, res) => {
  const { scanId, dishId, action, notes } = req.body ?? {};
  if (!dishId || !action) return res.status(400).json({ error: "dishId+action required" });

  if (isMockMode()) {
    console.log("[mock] feedback", { scanId, dishId, action, notes });
    return res.json({ ok: true });
  }

  await db().query(
    `INSERT INTO feedback (scan_id, dish_name, action, notes)
     VALUES ($1, $2, $3, $4)`,
    [scanId, dishId, action, notes ?? null]
  );
  res.json({ ok: true });
});
