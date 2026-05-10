// Orchestrator for the picking algorithm. Three stages — hard filter,
// Claude rank, shape — wired together with a timeout and a fallback.
// See design/algorithm.md §6.

import { isMockMode } from "../db.js";
import { dishes } from "../mockData.js";
import { hardFilter } from "./hardFilter.js";
import { rankWithClaude } from "./claudeRank.js";
import { shape, crowdFavoriteFallback } from "./shape.js";

// Pipeline-internal types. Loose by design so the three stages can compose
// across mock + live data shapes without ceremony.
type Dish = {
  id: string;
  name: string;
  priceInr: number;
  description?: string;
  crowdFavorite?: boolean;
  estCalories?: number;
  estMacros?: { protein?: number; carbs?: number; fat?: number };
  allergens?: string[];
  diet?: string[];
};
type Pick = { dish: Dish; reason: string };

export async function visionScanMenu(_imageBase64: string): Promise<Dish[]> {
  if (isMockMode()) return dishes as Dish[];

  // Live mode — uncomment once @anthropic-ai/sdk is installed.
  // npm install @anthropic-ai/sdk
  //
  // const Anthropic = (await import("@anthropic-ai/sdk")).default;
  // const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  // const r = await client.messages.create({
  //   model: "claude-sonnet-4-6",
  //   max_tokens: 4000,
  //   messages: [{
  //     role: "user",
  //     content: [
  //       { type: "image", source: { type: "base64", media_type: "image/jpeg", data: _imageBase64 } },
  //       { type: "text", text: `Extract every dish from this restaurant menu. Return JSON only:
  //         { "dishes": [ { "id": "<slug>", "name": "<name>", "priceInr": <number>, "description": "<line>", "estCalories": <number|null>, "allergens": ["dairy"|"gluten"|...], "diet": ["veg"|"vegan"|"jain"|null] } ] }
  //         Be conservative on allergen tags. Estimate calories; null if unsure.` }
  //     ]
  //   }]
  // });
  // const text = r.content[0].type === "text" ? r.content[0].text : "";
  // return JSON.parse(text.match(/\{[\s\S]*\}/)![0]).dishes;

  throw new Error("claude.visionScanMenu live mode not wired — install @anthropic-ai/sdk");
}

export async function recommend(
  menu: Dish[],
  prefs: Record<string, any>,
  context?: Record<string, any>
): Promise<any> {
  // ── Stage 1 — hard filter ────────────────────────────────────────────
  const filtered = hardFilter(menu, prefs as any);

  if (filtered.dishes.length < 3) {
    return {
      blocked: filtered.blocked ?? "allergen",
      suggestion: blockMessage(filtered.blocked ?? "allergen")
    };
  }

  // ── Stage 2 — Claude rank, with timeout + fallback ───────────────────
  let raw;
  try {
    raw = await Promise.race([
      rankWithClaude({
        restaurant: context?.restaurant ?? { name: "this restaurant" },
        diner: prefs as any,
        context: context?.context,
        menu: filtered.dishes as any
      }),
      timeout(3000)
    ]);
  } catch (e) {
    // 3-second timeout or API error — fall back to crowd-favorites
    return crowdFavoriteFallback(filtered.dishes as any, 3);
  }

  // ── Stage 3 — validate, dedupe, diversify ────────────────────────────
  return shape(raw, filtered.dishes as any);
}

function timeout(ms: number): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("claude timeout")), ms));
}

function blockMessage(blocked: string): string {
  switch (blocked) {
    case "allergen":
      return "Nothing on this menu clears your allergens — try removing one or scan a different menu.";
    case "diet":
      return "Nothing matches your diet here — would you like to soften it for this meal?";
    case "budget":
      return "Nothing under your budget — relax to under ₹500?";
    case "calorie":
      return "Nothing under your calorie cap — relax for this meal?";
    default:
      return "We couldn't find a clean match — try softening one filter.";
  }
}
