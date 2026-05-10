// Stage 1 of the picking algorithm. Pure TypeScript, deterministic, runs in
// <10 ms. See design/algorithm.md §3.
//
// Drops dishes that violate hard constraints — allergens, diet, calorie cap,
// budget. Never relaxes these. If the menu drops below 3 dishes, returns
// {dishes:[], blocked:"allergen|diet|budget|calorie"} so the API can surface
// a "relax a constraint?" state instead of returning bad picks.

type Dish = {
  id: string;
  name: string;
  priceInr: number;
  estCalories?: number;
  allergens?: string[];
  diet?: string[];
};

type Prefs = {
  diet?: "veg" | "vegan" | "jain" | "nonveg";
  allergens?: string[];
  budgetMaxInr?: number;
  health?: { calorieMax?: number };
};

const DIET_RULES: Record<string, (d: Dish) => boolean> = {
  veg: (d) => d.diet?.includes("veg") ?? false,
  vegan: (d) => d.diet?.includes("vegan") ?? false,
  jain: (d) => d.diet?.includes("jain") ?? false,
  // nonveg has no restriction — eat everything
  nonveg: () => true
};

export type FilterResult =
  | { dishes: Dish[]; blocked: null }
  | { dishes: Dish[]; blocked: "allergen" | "diet" | "budget" | "calorie"; survivors: Dish[] };

export function hardFilter(menu: Dish[], prefs: Prefs): FilterResult {
  let survivors = [...menu];

  // Track which filter dropped the most dishes (for the "relax which?" hint).
  const drops = { allergen: 0, diet: 0, budget: 0, calorie: 0 };

  if (prefs.allergens?.length) {
    const before = survivors.length;
    survivors = survivors.filter((d) => {
      const overlap = (d.allergens ?? []).some((a) => prefs.allergens!.includes(a));
      return !overlap;
    });
    drops.allergen = before - survivors.length;
  }

  if (prefs.diet && prefs.diet !== "nonveg") {
    const rule = DIET_RULES[prefs.diet];
    if (rule) {
      const before = survivors.length;
      survivors = survivors.filter(rule);
      drops.diet = before - survivors.length;
    }
  }

  if (prefs.budgetMaxInr) {
    const before = survivors.length;
    survivors = survivors.filter((d) => d.priceInr <= prefs.budgetMaxInr!);
    drops.budget = before - survivors.length;
  }

  if (prefs.health?.calorieMax) {
    const before = survivors.length;
    survivors = survivors.filter(
      (d) => !d.estCalories || d.estCalories <= prefs.health!.calorieMax!
    );
    drops.calorie = before - survivors.length;
  }

  if (survivors.length >= 3) {
    return { dishes: survivors, blocked: null };
  }

  // Below 3 — figure out which constraint blocked the most.
  const blocked = (Object.entries(drops) as ["allergen" | "diet" | "budget" | "calorie", number][])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "allergen";

  return { dishes: [], blocked, survivors };
}
