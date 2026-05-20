// Orchestrator for the picking algorithm. Three stages — hard filter,
// Claude rank, shape — wired together with a timeout and a fallback.
// See design/algorithm.md §6.

import Anthropic from "@anthropic-ai/sdk";
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

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error("ANTHROPIC_API_KEY not set");
    _client = new Anthropic({ apiKey: key });
  }
  return _client;
}

const VISION_PROMPT = `Extract every dish from this restaurant menu photo. Return strict JSON only:

{ "dishes": [
    { "id": "<short slug, lowercase, underscores>",
      "name": "<dish name as printed>",
      "priceInr": <integer rupees, or null if not visible>,
      "description": "<one-line description if printed, else empty>",
      "estCalories": <integer estimate from typical recipe, or null>,
      "estMacros": { "protein": <g>, "carbs": <g>, "fat": <g> },
      "allergens": ["dairy"|"nuts"|"gluten"|"eggs"|"shellfish"|"soy"],
      "diet": ["veg"|"vegan"|"jain"|"gluten-free"] }
  ] }

Rules:
- One entry per visible dish. Skip categories/section headers.
- Be conservative on allergens — only mark when obvious from name (paneer→dairy, naan→gluten).
- Estimate calories and macros from typical Indian/regional recipes. Null if truly unsure.
- For veg dishes set diet:["veg"]. Vegan only if no dairy/eggs explicit.
- Indian menus often have ₹ as price prefix. Strip and use integer.`;

export async function visionScanMenu(imageBase64: string): Promise<Dish[]> {
  if (isMockMode() || !process.env.ANTHROPIC_API_KEY) {
    return dishes as Dish[];
  }

  // Strip any data: URL prefix the caller forgot to remove
  const b64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  const r = await client().messages.create({
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: b64
            }
          },
          { type: "text", text: VISION_PROMPT }
        ]
      }
    ]
  });

  const text = r.content[0].type === "text" ? r.content[0].text : "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("vision returned no JSON");
  const json = JSON.parse(match[0]);
  if (!Array.isArray(json.dishes)) throw new Error("vision returned no dishes array");
  return json.dishes as Dish[];
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
