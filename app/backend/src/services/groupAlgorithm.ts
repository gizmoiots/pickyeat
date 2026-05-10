// Group mode algorithm. Per design/algorithm.md §9.
// Find dishes that EVERY member can eat AND at least 2 members prefer.
// If no overlap exists, surface the "split the order" suggestion.

import { hardFilter } from "./hardFilter.js";

type Dish = {
  id: string;
  name: string;
  priceInr: number;
  estCalories?: number;
  allergens?: string[];
  diet?: string[];
};

type MemberPrefs = {
  diet?: string;
  allergens?: string[];
  spice?: string;
  budgetMaxInr?: number;
  health?: { calorieMax?: number };
};

type GroupResult =
  | {
      mode: "shared";
      shared: { dishId: string; reason: string }[];
    }
  | {
      mode: "split";
      reason: string;
      perMember: { memberId: string; picks: { dishId: string; reason: string }[] }[];
    };

export function groupPick(
  members: { id: string; name: string; prefs: MemberPrefs }[],
  menu: Dish[]
): GroupResult {
  // 1. Compute the UNION of allergens (most restrictive across the group).
  const unionAllergens = new Set<string>();
  for (const m of members) {
    for (const a of m.prefs.allergens ?? []) unionAllergens.add(a);
  }

  // 2. Compute the INTERSECTION of compatible diets. If anyone is vegan,
  //    every shared dish must be vegan. If anyone is vegetarian, all must be
  //    veg. nonveg is the permissive baseline.
  const mostRestrictiveDiet = mostRestrictive(members.map((m) => m.prefs.diet));

  // 3. Hardest budget = lowest budget among members who set one.
  const budgetCaps = members
    .map((m) => m.prefs.budgetMaxInr)
    .filter((b): b is number => typeof b === "number");
  const tightestBudget = budgetCaps.length ? Math.min(...budgetCaps) : undefined;

  // 4. Tightest calorie cap = lowest calorieMax among members who set one.
  const calorieCaps = members
    .map((m) => m.prefs.health?.calorieMax)
    .filter((c): c is number => typeof c === "number");
  const tightestCalorie = calorieCaps.length ? Math.min(...calorieCaps) : undefined;

  // 5. Run hard filter against the worst-case union.
  const unionPrefs: MemberPrefs = {
    diet: mostRestrictiveDiet,
    allergens: Array.from(unionAllergens),
    budgetMaxInr: tightestBudget,
    health: tightestCalorie ? { calorieMax: tightestCalorie } : undefined
  };
  const filtered = hardFilter(menu, unionPrefs as any);

  if (filtered.dishes.length >= 3) {
    // Plenty of overlap — return shared picks.
    return {
      mode: "shared",
      shared: filtered.dishes.slice(0, 3).map((d) => ({
        dishId: d.id,
        reason: `clears everyone — ${countLikely(members, d)} of ${members.length} actively want this`
      }))
    };
  }

  // 6. Not enough overlap — split the order.
  return {
    mode: "split",
    reason:
      filtered.blocked === "diet"
        ? "Your diets don't fully overlap — easier to order separately"
        : filtered.blocked === "allergen"
        ? "Too many allergens to combine — order each person's plate individually"
        : "Tight constraints — splitting the order keeps everyone happy",
    perMember: members.map((m) => {
      const individual = hardFilter(menu, m.prefs as any);
      return {
        memberId: m.id,
        picks: individual.dishes.slice(0, 2).map((d) => ({
          dishId: d.id,
          reason: `picked for ${m.name}`
        }))
      };
    })
  };
}

function mostRestrictive(diets: (string | undefined)[]): string | undefined {
  const order = ["vegan", "jain", "veg", "nonveg"];
  const present = diets.filter(Boolean) as string[];
  if (!present.length) return undefined;
  return order.find((d) => present.includes(d));
}

function countLikely(
  members: { prefs: MemberPrefs }[],
  dish: Dish
): number {
  // Crude "actively wants this" heuristic — member preferences naturally
  // align with the dish if their declared signals overlap with dish tags.
  // Replace with the LLM-based scoring when claudeRank handles group mode.
  return members.filter((m) => {
    const wantsVeg = m.prefs.diet === "veg" || m.prefs.diet === "vegan" || m.prefs.diet === "jain";
    const isVeg = dish.diet?.includes("veg") ?? false;
    return wantsVeg ? isVeg : true;
  }).length;
}
