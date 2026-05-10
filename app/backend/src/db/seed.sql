-- pickyeat — demo seed
-- Boots a fresh DB into the same state as the mock data so a brand-new
-- live install is instantly demo-able.

INSERT INTO users (id, name, phone, language, diet_default, allergens, spice_default, health_goal, taste_vector, consent_at)
VALUES (
  '00000000-0000-0000-0000-00000000a1a1',
  'Aarav',
  '+91 9876512472',
  'en-IN',
  'nonveg',
  ARRAY['peanuts','shellfish']::TEXT[],
  'medium',
  'bulking',
  '{"summary": "spicy, high-protein, ₹200–400 dishes"}'::jsonb,
  NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (id, google_place_id, name, address, google_rating, google_review_count, cuisine_tags, bestsellers, bestsellers_updated_at)
VALUES (
  '00000000-0000-0000-0000-0000c0fee001',
  'ChIJ_pune_cafe_mocha_fc_road',
  'Cafe Mocha',
  'FC Road, Shivajinagar, Pune 411005',
  4.3,
  1248,
  ARRAY['north-indian','cafe','all-day-dining']::TEXT[],
  '{"Butter chicken": 12, "Paneer tikka masala": 7}'::jsonb,
  NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO menus_cache (id, restaurant_id, parsed_menu, scan_count, source)
VALUES (
  '00000000-0000-0000-0000-0000c0ffee01',
  '00000000-0000-0000-0000-0000c0fee001',
  '{
    "dishes": [
      {"id": "dish_butter_chicken",       "name": "Butter chicken",       "priceInr": 420, "crowdFavorite": true,  "estCalories": 520, "allergens": ["dairy"]},
      {"id": "dish_paneer_tikka_masala",  "name": "Paneer tikka masala",  "priceInr": 360, "estCalories": 480, "allergens": ["dairy"], "diet": ["veg"]},
      {"id": "dish_dal_makhani",          "name": "Dal makhani",          "priceInr": 280, "estCalories": 380, "allergens": ["dairy"], "diet": ["veg"]},
      {"id": "dish_garlic_naan",          "name": "Garlic naan",          "priceInr": 70,  "estCalories": 220, "allergens": ["gluten"], "diet": ["veg"]},
      {"id": "dish_mango_lassi",          "name": "Mango lassi",          "priceInr": 140, "estCalories": 260, "allergens": ["dairy"], "diet": ["veg"]}
    ]
  }'::jsonb,
  47,
  'restaurant_claim'
)
ON CONFLICT (id) DO NOTHING;
