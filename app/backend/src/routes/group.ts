import { Router } from "express";
import { sampleGroup } from "../mockData.js";
import { isMockMode } from "../db.js";

// POST /api/group        — create new group, host posts prefs
// GET  /api/group/:code  — get current state
// POST /api/group/:code/join — member joins with prefs
// POST /api/group/:code/recommend — host triggers union-pick

export const groupRouter = Router();

groupRouter.get("/:code", (req, res) => {
  if (isMockMode()) {
    if (req.params.code !== "4827") return res.status(404).json({ error: "not found" });
    return res.json(sampleGroup);
  }
  return res.status(501).json({ error: "group live mode not wired" });
});

groupRouter.post("/", (req, res) => {
  if (isMockMode()) {
    return res.json({ ...sampleGroup, code: String(Math.floor(1000 + Math.random() * 9000)) });
  }
  return res.status(501).json({ error: "group create live mode not wired" });
});

groupRouter.post("/:code/join", (req, res) => {
  if (isMockMode()) return res.json({ ok: true });
  return res.status(501).json({ error: "group join live mode not wired" });
});
