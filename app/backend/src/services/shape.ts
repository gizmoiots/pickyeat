// Stage 3 of the picking algorithm. Pure TypeScript, deterministic.
// Validates and shapes Claude's raw output into final picks. See
// design/algorithm.md §5.

type Dish = {
  id: string;
  name: string;
  priceInr: number;
  crowdFavorite?: boolean;
};

type RawPick = { dishId: string; reason: string };
type Pick = { dish: Dish; reason: string };

const BANNED_WORDS = [
  "amazing", "delicious", "yum", "yummy", "curated", "ai-powered",
  "discover", "journey", "tantalizing", "mouth-watering", "delight"
];

const MAX_REASON_WORDS = 15;

export function shape(rawPicks: RawPick[], filteredMenu: Dish[]): Pick[] {
  const byId = new Map(filteredMenu.map((d) => [d.id, d]));

  // 1. Validate dish existence — drop hallucinations.
  let valid = rawPicks
    .filter((p) => byId.has(p.dishId))
    .map((p) => ({ dish: byId.get(p.dishId)!, reason: lintReason(p.reason) }));

  // 2. De-dupe — same dishId can't appear twice.
  const seen = new Set<string>();
  valid = valid.filter((p) => {
    if (seen.has(p.dish.id)) return false;
    seen.add(p.dish.id);
    return true;
  });

  // 3. Backfill if Claude returned fewer than 3 valid picks. Use the crowd
  //    fallback to fill remaining slots.
  if (valid.length < 3) {
    const fallback = crowdFavoriteFallback(filteredMenu, 3 - valid.length, seen);
    valid = valid.concat(fallback);
  }

  // 4. Diversity — if all three are over ₹300, swap one for the cheapest
  //    sub-₹200 dish to round out the order.
  const allHeavy = valid.every((p) => p.dish.priceInr > 300);
  if (allHeavy) {
    const cheapSide = filteredMenu
      .filter((d) => d.priceInr <= 200 && !seen.has(d.id))
      .sort((a, b) => a.priceInr - b.priceInr)[0];
    if (cheapSide) {
      valid[2] = {
        dish: cheapSide,
        reason: `rounds out the order — ₹${cheapSide.priceInr} ${cheapSide.name.toLowerCase()}`
      };
    }
  }

  return valid.slice(0, 3);
}

export function crowdFavoriteFallback(
  menu: Dish[],
  n: number,
  exclude: Set<string> = new Set()
): Pick[] {
  return menu
    .filter((d) => !exclude.has(d.id))
    .sort((a, b) => {
      const aFav = a.crowdFavorite ? 1 : 0;
      const bFav = b.crowdFavorite ? 1 : 0;
      return bFav - aFav;
    })
    .slice(0, n)
    .map((dish, i) => {
      exclude.add(dish.id);
      return {
        dish,
        reason: dish.crowdFavorite
          ? "crowd favourite — most-ordered dish at this restaurant"
          : i === 0
          ? "safe bet — most diners enjoy this one"
          : "popular choice at this restaurant"
      };
    });
}

function lintReason(raw: string): string {
  let s = raw.trim();

  // Strip exclamation marks.
  s = s.replace(/!+/g, ".");

  // Truncate to 15 words.
  const words = s.split(/\s+/);
  if (words.length > MAX_REASON_WORDS) {
    s = words.slice(0, MAX_REASON_WORDS).join(" ") + "…";
  }

  // Detect banned words; if present, fall back to a generic line. Don't try to
  // surgically remove — replacing "amazing" with nothing creates bad grammar.
  const lower = s.toLowerCase();
  if (BANNED_WORDS.some((w) => lower.includes(w))) {
    return "matches what most diners order at this restaurant";
  }

  return s;
}

export const _testing = { lintReason, BANNED_WORDS };
