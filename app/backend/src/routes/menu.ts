import { Router } from "express";
import { cafeMocha, dishes } from "../mockData.js";
import { db, isMockMode } from "../db.js";

// GET /api/menu/:restaurantId

export const menuRouter = Router();

menuRouter.get("/:restaurantId", async (req, res) => {
  if (isMockMode()) {
    return res.json({ restaurant: cafeMocha, dishes });
  }

  const { rows } = await db().query(
    `SELECT r.*, m.parsed_menu
     FROM restaurants r
     LEFT JOIN menus_cache m ON m.restaurant_id = r.id
     WHERE r.id = $1
     ORDER BY m.last_seen_at DESC NULLS LAST
     LIMIT 1`,
    [req.params.restaurantId]
  );
  if (!rows.length) return res.status(404).json({ error: "restaurant not found" });

  const r = rows[0];
  res.json({
    restaurant: {
      id: r.id,
      name: r.name,
      address: r.address,
      cuisineTags: r.cuisine_tags,
      googleRating: r.google_rating,
      googleReviewCount: r.google_review_count,
      bestsellers: r.bestsellers ? Object.keys(r.bestsellers) : []
    },
    dishes: r.parsed_menu?.dishes ?? []
  });
});
