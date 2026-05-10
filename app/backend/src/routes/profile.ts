import { Router } from "express";
import { sampleProfile } from "../mockData.js";
import { isMockMode, db } from "../db.js";

// GET  /api/profile
// PUT  /api/profile

export const profileRouter = Router();

profileRouter.get("/", async (_req, res) => {
  if (isMockMode()) return res.json(sampleProfile);

  // Real impl: extract userId from session token middleware (TODO).
  const userId = "usr_aarav";
  const { rows } = await db().query(`SELECT * FROM users WHERE id = $1`, [userId]);
  if (!rows.length) return res.status(404).json({ error: "profile not found" });
  res.json(rows[0]);
});

profileRouter.put("/", async (req, res) => {
  if (isMockMode()) return res.json({ ...sampleProfile, ...req.body });
  return res.status(501).json({ error: "profile update live mode not wired" });
});
