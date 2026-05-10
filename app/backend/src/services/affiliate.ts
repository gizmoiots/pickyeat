// Affiliate deep-link builders for Zomato + Swiggy.
// Returns the URL plus an internal click_id for attribution.

import { randomBytes } from "node:crypto";

const ZOMATO_AFFILIATE_CODE = process.env.ZOMATO_AFFILIATE_CODE ?? "PICKYEAT";
const SWIGGY_AFFILIATE_CODE = process.env.SWIGGY_AFFILIATE_CODE ?? "PICKYEAT";

type Restaurant = {
  name: string;
  googlePlaceId?: string;
  address?: string;
};

type Dish = {
  name: string;
  priceInr: number;
};

type AffiliateLink = {
  platform: "zomato" | "swiggy";
  url: string;
  clickId: string;
};

// In-memory click log. Production: dish_clicks table for attribution.
const clicks = new Map<string, { restaurant: string; dish: string; platform: string; at: number }>();

export function buildZomatoLink(restaurant: Restaurant, dish: Dish): AffiliateLink {
  const clickId = randomBytes(8).toString("hex");
  clicks.set(clickId, {
    restaurant: restaurant.name,
    dish: dish.name,
    platform: "zomato",
    at: Date.now()
  });

  // Zomato's app deep-link if available, web fallback otherwise. The actual
  // affiliate parameter name comes from the partner program agreement —
  // placeholder here, swap to the real one once Zomato approves the program.
  const q = encodeURIComponent(`${dish.name} at ${restaurant.name}`);
  const url = `https://www.zomato.com/pune?search=${q}&utm_source=pickyeat&utm_medium=referral&utm_campaign=${ZOMATO_AFFILIATE_CODE}&ref=${clickId}`;

  return { platform: "zomato", url, clickId };
}

export function buildSwiggyLink(restaurant: Restaurant, dish: Dish): AffiliateLink {
  const clickId = randomBytes(8).toString("hex");
  clicks.set(clickId, {
    restaurant: restaurant.name,
    dish: dish.name,
    platform: "swiggy",
    at: Date.now()
  });

  const q = encodeURIComponent(`${dish.name} ${restaurant.name}`);
  const url = `https://www.swiggy.com/search?query=${q}&utm_source=pickyeat&utm_medium=referral&utm_campaign=${SWIGGY_AFFILIATE_CODE}&ref=${clickId}`;

  return { platform: "swiggy", url, clickId };
}

export function recordConversion(clickId: string): void {
  const click = clicks.get(clickId);
  if (!click) return;
  console.log(`[affiliate] conversion: ${click.platform} · ${click.restaurant} · ${click.dish}`);
  // Real impl — insert into affiliate_conversions table for monthly payout reconciliation
}
