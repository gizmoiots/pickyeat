# Stitch iteration log

## v1 — 2026-05-08

Output saved to `design/stitch-output-v1/`. 28 rendered screens + 4 empty placeholder folders + a `STITCH-DESIGN.md` token spec.

### Verdict in one line

The brand survived translation cleanly — saffron, sprig, pepper, coconut all show up correctly across screens, and the dot motif is consistently applied as both the upper-right card highlight and the active-tab indicator. Most failures are content drift, not visual drift.

### What landed well

- **Brand colors are accurate.** Stitch parsed `#F26B3A`, `#C8421C`, `#2BB673`, `#1F1B16`, `#FFF8EE` exactly. No hue shift.
- **The mint dot is a recurring motif** as designed — appears as card highlight, as the period after "pickyeat", as the active-state indicator under the bottom tab, and as the chip selection marker.
- **Plus Jakarta Sans is loaded** via Google Fonts CDN. Sentence case mostly held.
- **Mock data anchors are in place**: Cafe Mocha, FC Road, Pune; ₹420 / ₹360 / ₹280 prices; the exact reason strings ("matches your high-protein goal + 3 reviews call it the best in Pune").
- **The `picks_main_result` screen nailed the Coconut placeholder** — instead of stock food photos, it uses a saffron bowl-and-steam icon on a Coconut tile. This is the ONE screen that followed my "no stock food" rule.
- **`group_order_host_view` is excellent** — 4827 code in 60px, member chips with prefs (Aarav, Maya, Jordan, Sasha), "Find dishes that fit everyone" CTA, and a "Host tip" callout that wasn't in spec but adds value.
- **`profile_what_we_know`** is on-brand: "what we know about you" headline, taste analysis bar chart, all stored fields exposed (diet, allergens, spice, health goal, language), "Delete everything" link in Spice red.
- **`feedback_i_ordered_this`** is clean — dashed Coconut upload zone, three rating chips with the Sprig dot on "loved it", optional notes input.
- **`health_mode`** matches spec better than expected — 1,200–4,000 calorie slider, macro chips, dietary style 2x2, allergen multi-select with the Sprig dot on selected chips, "macros are estimates, ±20%" footer.

### What drifted

1. **Stitch named the app "Zaika" before settling on "pickyeat".** There's still a `welcome_to_zaika`, `zaika_home`, `zaika_home_dark_mode`, `zaika_dark_mode`, and `zaika_dining_concierge` folder. These are abandonware — delete or ignore. Stitch picked "Zaika" (Hindi for "taste/flavor") as a more on-theme name; worth a passing thought as an alternate brand if pickyeat doesn't survive trademark search, but otherwise discard.

2. **Stock food photography appeared on multiple screens** despite the "no stock photos" rule. Specifically: `gps_detect_cache_hit` shows a generic latte-art photo as "Today's Special", `mood_flow_craving` shows a "Spiced Avocado Bowl" stock photo, `dish_detail` uses a stock soup photo for butter chicken. Only `picks_main_result` followed the rule.

3. **The mark on the splash screen lost its dot.** The half-disc bowl is rendered correctly, but the mint dot above the bowl is gone — the dot now lives only on the wordmark as a period. Reattach it. The mark must always show the dot.

4. **The wordmark is in Spice (#C8421C), not Pepper (#1F1B16).** Stitch decided to color the entire wordmark in the deeper red, which makes "pickyeat" read like a logotype rather than a calm wordmark. The spec said Pepper text with a Sprig period.

5. **Bottom navs added on every screen** — even where I explicitly said "MVP has at most two nav items, not on every screen." Nearly every screen has a Home + Profile tab bar. Acceptable as a default but should be hidden on splash, scan, and modal flows.

6. **Stitch generated dark-mode variants I didn't ask for** (`mood_selection_dark_mode`, `recommendations_dark_mode`, `zaika_home_dark_mode`). Useful as a v1.5 deliverable; ignore for now.

7. **Headlines like "Find your flow." were invented** — I asked for clean eyebrow + content, Stitch added marketing-deck headlines on top. Strip these.

8. **CTA labels diverged from spec** — "Add to Pick" instead of "I ordered this" on the picks screen. The "I ordered this" interaction lives on `feedback_i_ordered_this` instead, which is fine architecturally but creates a naming inconsistency.

9. **The cafe_mocha_details screen invented dishes not in the spec** — Belgian Berry Waffle ₹426, Ethiopian Pour-over ₹350. These are off-brand for an Indian cafe and weren't in mock data. Replace with chai, filter coffee, dosa, etc.

### Fixes for v2 prompt

Append to the Stitch prompt:

```
HARD RULES — these failed in v1, do not repeat:

- The app is named "pickyeat" — never "Zaika" or any alternate name.
- The mark ALWAYS includes the mint dot above the bowl. Do not drop the dot from the splash, the header, or the app icon.
- The wordmark is rendered in Pepper (#1F1B16). Only the period after "pickyeat" is in Sprig (#2BB673). Do not color the whole wordmark in Spice.
- No stock food photography anywhere — including "today's special" cards, "popular right now" sections, and dish detail headers. Use the flat Coconut tile with a saffron bowl-and-steam icon as the universal placeholder.
- Bottom nav appears only on Home, Picks, and Profile screens. Hide on splash, camera, mood flow, dish detail, feedback, and group screens.
- Do not invent headlines or marketing copy. Use only the eyebrow + content patterns specified.
- All restaurant menu items are Indian — use chai, filter coffee, dosa, idli, paneer, dal, naan. Never invent western items like waffles, pour-over, ramen, pizza unless they were in the original mock data list.
- Light mode only for v1. Skip all dark-mode variants until v2.
```

### Screens to keep, regenerate, or drop

| Screen | Status | Action |
| --- | --- | --- |
| `splash_screen` | keep with fix | Reattach mint dot above the bowl mark |
| `gps_detect_cache_hit` | regenerate | Strip "Today's Special" stock photo card |
| `gps_detect_cache_miss` | check | (not viewed in detail yet) |
| `camera_scan` / `scan_menu` | check | Pick the better of the two duplicates |
| `mood_flow_craving` | regenerate | Strip "Popular right now" + "Find your flow." headline |
| `mood_toggles` | keep | Strip "Feeling adventurous?" stock-photo card at the bottom |
| `health_mode` | keep | No fixes needed |
| `picks_main_result` | keep | Best screen of the set — exemplar for the rest |
| `dish_detail` | regenerate | Replace stock soup photo with Coconut-tile placeholder |
| `feedback_i_ordered_this` | keep | Replace "Harvest Grain Bowl / Green Garden" with Cafe Mocha + butter chicken |
| `profile_what_we_know` | keep | No fixes needed |
| `group_order_host_view` | keep | Best execution of group screens |
| `group_recommendations` | keep | (not viewed in detail) |
| `cafe_mocha_details` | regenerate | Replace western menu items with Indian ones |
| `welcome_to_zaika` | drop | Wrong brand name |
| `zaika_home`, `zaika_home_dark_mode`, `zaika_dining_concierge`, `zaika_dark_mode` | drop | Wrong brand name |
| `mood_selection_dark_mode`, `recommendations_dark_mode` | defer to v2 | Dark mode out of scope for v1 |
| `modern_indian_premium`, `warm_minimalism` | drop | Empty placeholder folders |
| `our_recommendations`, `dish_details` | drop | Duplicates of `picks_main_result` and `dish_detail` |
