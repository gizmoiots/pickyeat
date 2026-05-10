import { Router } from "express";
import { recommend } from "../services/claude.js";
import { dishes as menu } from "../mockData.js";

// POST /api/recommend
//   body: { restaurantId, prefs }
//   returns: Pick[]

export const recommendRouter = Router();

recommendRouter.post("/", async (req, res) => {
  const { prefs } = req.body ?? {};
  const picks = await recommend(menu, prefs ?? {});
  res.json(picks);
});
