import { Router } from "express";
import { nearbyRestaurants } from "../services/places.js";

// GET /api/places/nearby?lat=&lng=

export const placesRouter = Router();

placesRouter.get("/nearby", async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ error: "lat,lng required" });
  }
  const results = await nearbyRestaurants(lat, lng);
  res.json(results[0] ?? null);
});
