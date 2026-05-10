// Shared types between frontend and backend.
// Keep field names in sync with backend/src/db/schema.sql.

export type Dish = {
  id: string;
  name: string;
  priceInr: number;
  description?: string;
  crowdFavorite?: boolean;
  reason?: string;            // populated when shown as a pick
  estCalories?: number;       // ±20%
  estMacros?: { protein?: number; carbs?: number; fat?: number };
  allergens?: string[];
  diet?: ("veg" | "vegan" | "jain" | "gluten-free")[];
};

export type Restaurant = {
  id: string;
  googlePlaceId: string;
  name: string;
  address: string;
  cuisineTags: string[];
  googleRating?: number;
  googleReviewCount?: number;
  scanCount?: number;         // surfaced as "47 picks here"
  bestsellers?: string[];     // dish names mentioned positively
};

export type Prefs = {
  craving?: "drinks" | "quick" | "food" | "full-meal";
  spice?: "mild" | "medium" | "hot" | "any";
  budgetMaxInr?: number;
  hunger?: "peckish" | "normal" | "starving";
  occasion?: "solo" | "date" | "business" | "family" | "celebration";
  diet?: string[];
  allergens?: string[];
  health?: {
    calorieMax?: number;
    macroFocus?: "high-protein" | "low-carb" | "balanced" | "low-fat";
  };
};

export type Pick = {
  dish: Dish;
  reason: string;
};

export type Group = {
  id: string;
  code: string;                  // 4-digit join code
  hostUserId: string;
  restaurantId: string;
  members: { id: string; name: string; prefs: Prefs }[];
  combinedPicks?: Pick[];
};

export type Profile = {
  id: string;
  name?: string;
  phone?: string;
  language: string;
  dietDefault?: "veg" | "vegan" | "jain" | "nonveg";
  allergens: string[];
  spiceDefault?: "mild" | "medium" | "hot";
  healthGoal?: "cutting" | "maintaining" | "bulking";
  tasteSummary?: string;         // human-readable summary like "spicy, high-protein, ₹200-400"
};
