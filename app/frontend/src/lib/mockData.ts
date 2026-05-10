import type { Dish, Restaurant, Pick, Group, Profile } from "./types";

// Mock data anchored on the architecture doc + Stitch v1 review.
// Used when NEXT_PUBLIC_API_MODE=mock (default) and as the seed reference
// for the Postgres seed file.

export const cafeMocha: Restaurant = {
  id: "rst_cafemocha",
  googlePlaceId: "ChIJ_pune_cafe_mocha_fc_road",
  name: "Cafe Mocha",
  address: "FC Road, Shivajinagar, Pune 411005",
  cuisineTags: ["north-indian", "cafe", "all-day-dining"],
  googleRating: 4.3,
  googleReviewCount: 1248,
  scanCount: 47,
  bestsellers: ["Butter chicken", "Paneer tikka masala"]
};

export const dishes: Dish[] = [
  {
    id: "dish_butter_chicken",
    name: "Butter chicken",
    priceInr: 420,
    description:
      "Slow-cooked North Indian classic in a silky tomato and butter gravy.",
    crowdFavorite: true,
    estCalories: 520,
    estMacros: { protein: 28, carbs: 22, fat: 32 },
    allergens: ["dairy"],
    diet: []
  },
  {
    id: "dish_paneer_tikka_masala",
    name: "Paneer tikka masala",
    priceInr: 360,
    description: "Charred paneer cubes in a spiced tomato-onion gravy.",
    estCalories: 480,
    estMacros: { protein: 22, carbs: 28, fat: 28 },
    allergens: ["dairy"],
    diet: ["veg"]
  },
  {
    id: "dish_dal_makhani",
    name: "Dal makhani",
    priceInr: 280,
    description: "Black lentils slow-cooked overnight with cream and butter.",
    estCalories: 380,
    estMacros: { protein: 14, carbs: 32, fat: 18 },
    allergens: ["dairy"],
    diet: ["veg"]
  },
  {
    id: "dish_garlic_naan",
    name: "Garlic naan",
    priceInr: 70,
    description: "Hand-stretched flatbread topped with garlic and coriander.",
    estCalories: 220,
    estMacros: { protein: 6, carbs: 38, fat: 4 },
    allergens: ["gluten"],
    diet: ["veg"]
  },
  {
    id: "dish_mango_lassi",
    name: "Mango lassi",
    priceInr: 140,
    description: "Yogurt drink with Alphonso mango pulp, lightly cardamom-spiced.",
    estCalories: 260,
    estMacros: { protein: 8, carbs: 42, fat: 6 },
    allergens: ["dairy"],
    diet: ["veg"]
  }
];

export const dishById = (id: string) => dishes.find((d) => d.id === id);

export const samplePicks: Pick[] = [
  {
    dish: dishes[0],
    reason: "matches your high-protein goal + 3 reviews call it the best in Pune"
  },
  {
    dish: dishes[2],
    reason: "lighter pick — you wanted under 500 cal"
  },
  {
    dish: dishes[3],
    reason: "pairs with the butter chicken everyone else picked"
  }
];

export const sampleGroup: Group = {
  id: "grp_4827",
  code: "4827",
  hostUserId: "usr_aarav",
  restaurantId: cafeMocha.id,
  members: [
    {
      id: "usr_aarav",
      name: "Aarav (you)",
      prefs: { spice: "medium", allergens: ["cilantro"] }
    },
    {
      id: "usr_maya",
      name: "Maya",
      prefs: { diet: ["vegan", "gluten-free"] }
    },
    {
      id: "usr_jordan",
      name: "Jordan",
      prefs: { allergens: ["nuts"] }
    },
    { id: "usr_sasha", name: "Sasha", prefs: {} }
  ]
};

export const sampleProfile: Profile = {
  id: "usr_aarav",
  name: "Aarav",
  phone: "+91 98•••••72",
  language: "en-IN",
  dietDefault: "nonveg",
  allergens: ["peanuts", "shellfish"],
  spiceDefault: "medium",
  healthGoal: "bulking",
  tasteSummary: "spicy, high-protein, ₹200–400 dishes"
};
