# Google Stitch prompt — pickyeat MVP

Paste the prompt below into Google Stitch as the project description. Attach `../brand/app-icon.svg` and a screenshot of `../brand/brand-preview.html` as image references so Stitch anchors on the real brand visuals.

Iterate by editing this file and re-pasting — keep the version that works for your records.

---

App: pickyeat — a mobile PWA that helps diners pick what to order from any restaurant menu. India-first, launching in Pune. Tagline: "Scan. Pick. Eat."

Audience: B2C consumers in India, ages 22–45, who eat out 2–4× a week and feel decision fatigue at unfamiliar menus.

Platform: Mobile-first responsive (375–414px wide). Designs should feel native on both iOS and Android. Show in iPhone-style frames.

## Brand system — apply throughout

Colors (use ONLY these five):
- Saffron `#F26B3A` — primary brand, primary CTAs, key accents
- Spice `#C8421C` — hover, depth, large display type on cream
- Sprig `#2BB673` — "the pick" — ONLY for the recurring dot motif and selected/recommended states (never as a background or large fill)
- Pepper `#1F1B16` — text (warm-black, never pure black)
- Coconut `#FFF8EE` — surfaces (warm-cream, never pure white)

Type: Plus Jakarta Sans — weights 400 (body), 500 (UI labels), 700 (display). Mukta for Hindi/Marathi. Sentence case throughout. No Title Case, no ALL CAPS.

Logo mark: A flat half-disc bowl in saffron with a small mint circle (Sprig) floating above and slightly right of center. The mint dot is the brand's load-bearing motif — it should reappear in the UI as a small Sprig circle: highlighting selected dishes, marking pins on the map, acting as the period in the wordmark "pickyeat."

Visual style: Warm minimal. Generous whitespace. NO drop shadows, NO gradients, NO neon glow, NO emoji. Borders thin (0.5px). Corners rounded — 12px cards, 16–20px panels, full pill for chips. Photography is REAL (user-uploaded dish photos), never stock-y.

## Screens — generate all 12 as a cohesive set

1. Splash — logo lockup centered on Coconut, eyebrow caps "scan · pick · eat" below, single saffron CTA "Allow location" at the bottom.

2. GPS detect (cache hit) — eyebrow "you're at", restaurant name in 26px Pepper, meta line "47 picks here this month", primary saffron CTA "Use saved menu", secondary link "Scan a different menu".

3. GPS detect (cache miss) — same layout, copy reads "Looks like you're at Cafe Mocha", primary CTA "Scan their menu" with camera icon.

4. Camera scan — full-screen camera viewport, dashed mint guide rectangle, small pill "Translate to English" upper right (Sprig dot when on).

5. Mood flow / craving — eyebrow "what are you craving?", 2×2 grid of tiles: Drinks, Quick, Food, Full meal. Saffron border on selected.

6. Mood flow / optional toggles — chip groups: spice (mild/medium/hot/any), budget (≤₹150/≤₹300/≤₹500/no limit), hunger, occasion. Saffron CTA "Show my picks".

7. Health mode — calorie target slider, macro focus chips (high protein, low carb, balanced), allergen multi-select chips, specific-diet chips. Footer note: "macros are estimates, ±20%".

8. Picks (main result) — restaurant name + address at top. Three picked dishes as vertical cards. Each card: photo thumbnail or Coconut placeholder, dish name, single-line reason, price in Pepper, small Sprig dot in upper-right corner of the card. Crowd-favorite dishes get a Sprig pill labeled "crowd favorite" (NOT a fire emoji).

9. Dish detail — large dish photo, dish name in 30px Pepper, price, full Claude reason ("Three reviews mention this. ~520 cal estimated, high protein, gluten-free."), saffron CTA "I ordered this" and a "Skip" link.

10. Feedback (I ordered this) — photo upload prompt "Share what it actually looked like", three rating chips (loved it / fine / disliked), optional notes input, saffron Save CTA.

11. Profile / "what we know about you" — clean stack of stored fields: diet defaults, allergens, spice tolerance, health goal, language, taste vector preview ("you tend to love: spicy, high-protein, ₹200–400 dishes"). Spice-red "Delete everything" link at the bottom.

12. Group order (host view) — large 4-digit code in 60px display, share button, list of joined members each with their pref chips, saffron CTA "Find dishes that fit everyone".

## Mock data — use these exact values

Restaurant: Cafe Mocha, FC Road, Pune. 4.3 ★ on Google. 47 picks this month.

Sample dishes:
- Butter chicken — ₹420 (crowd favorite)
- Paneer tikka masala — ₹360
- Dal makhani — ₹280
- Garlic naan — ₹70
- Mango lassi — ₹140

User name: Aarav. Group code: 4827.

Sample Claude reasons:
- "matches your high-protein goal + 3 reviews call it the best in Pune"
- "lighter pick — you wanted under 500 cal"
- "pairs with the butter chicken everyone else picked"

## Copy voice

Speak like a friend who's eaten there. Confident picks with reasons. No exclamations, no emoji walls, no words like "amazing", "delicious", "yum", "curated", "AI-powered", "discover". Use Indian vocabulary — thali, tiffin, naan. Render currency as ₹, no decimals.

## Do not

No drop shadows, gradients, blur, glow, neon. No stock food photography placeholders — use flat Coconut tiles with a tiny saffron bowl icon if a placeholder is needed. No bottom-nav clutter — MVP has at most two nav items (Home, Profile). No marketing copy on the splash screen.

---

## After Stitch generates

When you get the screens back from Stitch, save the export (Figma file or PNGs) under `design/stitch-output-v1/`. Note in `design/iteration-log.md` what worked and what didn't, then refine this prompt for v2.

Common things to fix on the second pass:
- Stitch tends to add fake bottom navs — remove them.
- Stitch defaults to glossy food photos — replace with the flat Coconut placeholder if real photos aren't available.
- Stitch may title-case headings — strip back to sentence case.
- Stitch sometimes uses a redder orange than `#F26B3A` — call out the exact hex if drift appears.
