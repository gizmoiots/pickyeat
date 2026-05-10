// Stage 2 of the picking algorithm. Single Claude call that returns three
// {dishId, reason} pairs. See design/algorithm.md §4.

import { isMockMode } from "../db.js";

type Dish = {
  id: string;
  name: string;
  priceInr: number;
  estCalories?: number;
  allergens?: string[];
  diet?: string[];
  crowdFavorite?: boolean;
};

type RankContext = {
  restaurant: {
    name: string;
    scanCount?: number;
    bestsellers?: Record<string, number>;
    googleRating?: number;
    address?: string;
  };
  diner: {
    craving?: string;
    spice?: string;
    hunger?: string;
    occasion?: string;
    budgetMaxInr?: number;
    health?: { goal?: string; calorieMax?: number; macroFocus?: string };
    diet?: string;
    allergens?: string[];
    tasteSummary?: string;
    recentLikes?: string[];
    recentDislikes?: string[];
  };
  context?: {
    timeOfDay?: string;
    weather?: string;
    isFirstVisit?: boolean;
  };
  menu: Dish[];
};

type RankedPick = { dishId: string; reason: string };

const SYSTEM_PROMPT = `You are pickyeat's picking engine.

Given a restaurant menu and a diner's preferences, return exactly 3 picks as JSON.

Brand voice rules — reasons MUST follow these:
- One sentence per pick, under 15 words
- Format: "matches your <personal signal> + <social signal>" when both available, otherwise lead with whichever is stronger
- Indian vocabulary preferred (thali / tiffin / naan / chai)
- Sentence case, no Title Case, no ALL CAPS
- Banned words: amazing, delicious, yum, curated, AI-powered, discover, journey, experience (as verb)
- No emoji, no exclamation marks
- Currency rendered as ₹ with no decimals

Ranking intent (priority order):
1. Mood / craving alignment — full-meal request never gets answered with drinks
2. Health goal alignment — bulking + high-protein gets pushed; cutting + low-cal gets pushed
3. Crowd signal — bestsellers from reviews, weighted by scan count
4. Personal taste history — recent likes in this cuisine or price band
5. Pairing logic — if you pick an entrée, look for a side / drink to round out
6. Context — weather (warmer dishes when raining), time of day (lighter at lunch)
7. Diversity — three picks should span at least two categories
8. Novelty — for repeat visitors, surface one dish they haven't ordered before

Output strict JSON only:
{"picks":[{"dishId":"<id from menu>","reason":"<sentence>"}]}`;

export async function rankWithClaude(ctx: RankContext): Promise<RankedPick[]> {
  if (isMockMode()) {
    return [
      {
        dishId: ctx.menu[0]?.id ?? "dish_unknown",
        reason: "matches your high-protein goal + 3 reviews call it the best here"
      },
      {
        dishId: ctx.menu[1]?.id ?? "dish_unknown",
        reason: "lighter pick — you wanted under 500 cal"
      },
      {
        dishId: ctx.menu[2]?.id ?? "dish_unknown",
        reason: "pairs with the butter chicken everyone else picked"
      }
    ];
  }

  // Live mode — uncomment once @anthropic-ai/sdk is installed.
  // npm install @anthropic-ai/sdk
  //
  // const Anthropic = (await import("@anthropic-ai/sdk")).default;
  // const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  //
  // const userMessage = buildUserMessage(ctx);
  // const r = await client.messages.create({
  //   model: "claude-sonnet-4-6",
  //   max_tokens: 800,
  //   system: SYSTEM_PROMPT,
  //   messages: [{ role: "user", content: userMessage }]
  // });
  //
  // const text = r.content[0].type === "text" ? r.content[0].text : "";
  // const json = JSON.parse(text.match(/\{[\s\S]*\}/)![0]);
  // return json.picks;

  throw new Error("claudeRank.rank live mode not wired — install @anthropic-ai/sdk and uncomment");
}

function buildUserMessage(ctx: RankContext): string {
  return JSON.stringify(
    {
      restaurant: ctx.restaurant,
      diner: ctx.diner,
      context: ctx.context ?? {
        timeOfDay: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        isFirstVisit: false
      },
      menu: ctx.menu.map((d) => ({
        id: d.id,
        name: d.name,
        priceInr: d.priceInr,
        estCalories: d.estCalories,
        allergens: d.allergens,
        diet: d.diet,
        crowdFavorite: d.crowdFavorite
      }))
    },
    null,
    0
  );
}

export const _testing = { buildUserMessage, SYSTEM_PROMPT };
