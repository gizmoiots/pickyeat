import { Router } from "express";
import { visionScanMenu } from "../services/claude.js";
import { cafeMocha } from "../mockData.js";

// POST /api/scan
//   body: { imageBase64: string, restaurantId?: string, gps?: {lat,lng} }
//   returns: { menuId, restaurant, dishes, fromCache: boolean }

export const scanRouter = Router();

scanRouter.post("/", async (req, res) => {
  const { imageBase64 } = req.body ?? {};
  if (!imageBase64) return res.status(400).json({ error: "imageBase64 required" });

  // TODO: phash dedup against menus_cache, fall through if miss.
  const dishes = await visionScanMenu(imageBase64);

  res.json({
    menuId: `menu_${Date.now()}`,
    restaurant: cafeMocha,
    dishes,
    fromCache: false
  });
});
