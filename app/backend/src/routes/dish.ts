import { Router } from "express";
import { dishes } from "../mockData.js";
import { isMockMode, db } from "../db.js";

// GET /api/dish/:id

export const dishRouter = Router();

dishRouter.get("/:id", async (req, res) => {
  if (isMockMode()) {
    const d = dishes.find((x) => x.id === req.params.id);
    if (!d) return res.status(404).json({ error: "dish not found" });
    return res.json(d);
  }

  // Real impl: dishes live inside menus_cache.parsed_menu rather than a
  // dedicated table — query the latest cache row that contains this dish_name.
  const { rows } = await db().query(
    `SELECT parsed_menu FROM menus_cache
     WHERE parsed_menu::text ILIKE $1
     ORDER BY last_seen_at DESC LIMIT 1`,
    [`%${req.params.id}%`]
  );
  if (!rows.length) return res.status(404).json({ error: "dish not found" });
  const d = (rows[0].parsed_menu?.dishes ?? []).find((x: any) => x.id === req.params.id);
  if (!d) return res.status(404).json({ error: "dish not found" });
  res.json(d);
});
