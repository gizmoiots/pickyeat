import { Router } from "express";
import { visionScanMenu } from "../services/claude.js";
import { nearbyRestaurants } from "../services/places.js";
import { isMockMode, q } from "../db.js";
import { cafeMocha } from "../mockData.js";

// POST /api/scan
//   body: { imageBase64: string, gps?: {lat,lng}, restaurantId?: string,
//           translateToEnglish?: boolean }
//   returns: { menuId, restaurant, dishes, fromCache: boolean }

export const scanRouter = Router();

scanRouter.post("/", async (req, res) => {
  const { imageBase64, gps, restaurantId } = req.body ?? {};
  if (!imageBase64) return res.status(400).json({ error: "imageBase64 required" });

  // 1. Identify the restaurant.
  let restaurant: any = null;
  if (isMockMode()) {
    restaurant = cafeMocha;
  } else if (restaurantId) {
    const [r] = await q(
      `SELECT id, google_place_id, name, address, google_rating, google_review_count, cuisine_tags, bestsellers
       FROM restaurants WHERE id = $1`,
      [restaurantId]
    );
    restaurant = r ?? null;
  } else if (gps?.lat && gps?.lng) {
    const list = await nearbyRestaurants(gps.lat, gps.lng);
    restaurant = list[0] ?? null;
    if (restaurant) {
      // Upsert into restaurants table
      const [row] = await q(
        `INSERT INTO restaurants (google_place_id, name, address, google_rating, google_review_count, cuisine_tags)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (google_place_id) DO UPDATE SET
           name = EXCLUDED.name, address = EXCLUDED.address,
           google_rating = EXCLUDED.google_rating,
           google_review_count = EXCLUDED.google_review_count
         RETURNING id, google_place_id, name, address, google_rating, google_review_count, cuisine_tags`,
        [
          restaurant.googlePlaceId,
          restaurant.name,
          restaurant.address,
          restaurant.googleRating ?? null,
          restaurant.googleReviewCount ?? null,
          restaurant.cuisineTags ?? []
        ]
      );
      restaurant = row;
    }
  }

  // 2. VLM scan the menu (cache lookup happens client-side or via /api/menu).
  let dishes;
  try {
    dishes = await visionScanMenu(imageBase64);
  } catch (e: any) {
    console.error("[scan] vision failed:", e);
    return res.status(500).json({ error: "vision_failed", message: e.message });
  }

  // 3. Persist menu cache if we have a restaurant + DB.
  let menuId: string | null = null;
  if (!isMockMode() && restaurant?.id) {
    const [row] = await q(
      `INSERT INTO menus_cache (restaurant_id, parsed_menu, scan_count, last_seen_at, source)
       VALUES ($1, $2, 1, NOW(), 'user_scan')
       ON CONFLICT (id) DO NOTHING
       RETURNING id`,
      [restaurant.id, { dishes }]
    );
    menuId = row?.id ?? null;
  }

  res.json({
    menuId: menuId ?? `menu_${Date.now()}`,
    restaurant: restaurant ?? cafeMocha,
    dishes,
    fromCache: false
  });
});
