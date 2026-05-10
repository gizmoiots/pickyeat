import "dotenv/config";
import express from "express";
import cors from "cors";

import { scanRouter } from "./routes/scan.js";
import { recommendRouter } from "./routes/recommend.js";
import { menuRouter } from "./routes/menu.js";
import { feedbackRouter } from "./routes/feedback.js";
import { authRouter } from "./routes/auth.js";
import { historyRouter } from "./routes/history.js";
import { groupRouter } from "./routes/group.js";
import { photoRouter } from "./routes/photo.js";
import { placesRouter } from "./routes/places.js";
import { dishRouter } from "./routes/dish.js";
import { profileRouter } from "./routes/profile.js";
import { ownerRouter } from "./routes/owner.js";
import { billingRouter } from "./routes/billing.js";
import { rateLimit } from "./middleware/rateLimit.js";
import { initSentry, captureError } from "./sentry.js";

// Fire and forget — Sentry init must not block the server boot
void initSentry();

const app = express();
const port = Number(process.env.PORT ?? 4000);

// CORS — lock to canonical pickyeat.com origins in production
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://pickyeat.com", "https://www.pickyeat.com", "https://pickyeat.in", "https://pickeat.in"]
    : true; // any in dev

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "8mb" }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    mode: process.env.API_MODE ?? "mock",
    db: process.env.DATABASE_URL ? "configured" : "not-configured"
  });
});

// Rate-limit the expensive endpoints
const HOUR = 60 * 60 * 1000;
app.use("/api/scan", rateLimit("scan", { windowMs: HOUR, max: 10 }), scanRouter);
app.use(
  "/api/recommend",
  rateLimit("recommend", { windowMs: HOUR, max: 30 }),
  recommendRouter
);
app.use("/api/places", rateLimit("places", { windowMs: HOUR, max: 60 }), placesRouter);

app.use("/api/menu", menuRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/auth", authRouter);
app.use("/api/history", historyRouter);
app.use("/api/group", groupRouter);
app.use("/api/photo", photoRouter);
app.use("/api/dish", dishRouter);
app.use("/api/profile", profileRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/billing", billingRouter);

// Global error handler — capture to Sentry, return clean JSON
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  captureError(err, { path: _req.path, method: _req.method });
  res.status(500).json({ error: "internal_error", message: "Something broke. We're looking." });
});

app.listen(port, () => {
  console.log(`pickyeat-backend on :${port} (mode=${process.env.API_MODE ?? "mock"})`);
});
