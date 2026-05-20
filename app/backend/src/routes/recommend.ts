import { Router } from "express";
import { recommend } from "../services/claude.js";
import { isMockMode, q } from "../db.js";
import { dishes as mockMenu, cafeMocha } from "../mockData.js";

// POST /api/recommend
//   body: { restaurantId?, menuId?, prefs, context? }
//   returns: Pick[]  or  { blocked, suggestion }

export const recommendRouter = Router();

recommendRouter.post("/", async (req, res) => {
  const { prefs, restaurantId, menuId, context } = req.body ?? {};

  // Resolve the menu we're recommending from
  let menu = mockMenu;
  let restaurant = cafeMocha;

  if (!isMockMode()) {
    if (menuId) {
      const [row] = await q(
        `SELECT parsed_menu, restaurant_id FROM menus_cache WHERE id = $1`,
        [menuId]
      );
      if (row?.parsed_menu?.dishes) menu = row.parsed_menu.dishes;
      if (row?.restaurant_id) {
        const [r] = await q(
          `SELECT id, name, address, google_rating, google_review_count, bestsellers, cuisine_tags
           FROM restaurants WHERE id = $1`,
          [row.restaurant_id]
        );
        if (r) restaurant = r;
      }
    } else if (restaurantId) {
      const [row] = await q(
        `SELECT m.parsed_menu, r.id, r.name, r.address, r.google_rating, r.google_review_count, r.bestsellers, r.cuisine_tags
         FROM restaurants r
         LEFT JOIN menus_cache m ON m.restaurant_id = r.id
         WHERE r.id = $1
         ORDER BY m.last_seen_at DESC NULLS LAST
         LIMIT 1`,
        [restaurantId]
      );
      if (row?.parsed_menu?.dishes) menu = row.parsed_menu.dishes;
      if (row) restaurant = row as any;
    }
  }

  try {
    const picks = await recommend(menu as any, prefs ?? {}, {
      restaurant: {
        name: restaurant.name,
        scanCount: (restaurant as any).scanCount,
        bestsellers: (restaurant as any).bestsellers,
        googleRating: (restaurant as any).googleRating,
        address: restaurant.address
      },
      context
    });
    res.json(picks);
  } catch (e: any) {
    console.error("[recommend] failed:", e);
    res.status(500).json({ error: "recommend_failed", message: e.message });
  }
});
