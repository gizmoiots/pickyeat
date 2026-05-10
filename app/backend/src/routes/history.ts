import { Router } from "express";
import { isMockMode, db } from "../db.js";
import { dishes } from "../mockData.js";

// GET /api/history?userId=...

export const historyRouter = Router();

historyRouter.get("/", async (req, res) => {
  if (isMockMode()) {
    return res.json([
      {
        id: "scan_demo",
        restaurantName: "Cafe Mocha",
        when: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        picks: dishes.slice(0, 3).map((d) => d.name)
      }
    ]);
  }

  const { rows } = await db().query(
    `SELECT s.id, r.name AS restaurant_name, s.created_at, s.picks
     FROM scans s
     LEFT JOIN restaurants r ON r.id = s.restaurant_id
     WHERE s.user_id = $1
     ORDER BY s.created_at DESC
     LIMIT 50`,
    [req.query.userId]
  );
  res.json(rows);
});
