# pickyeat — brand identity

Version 1.0 · 2026-05-08

This is the founding brand book for pickyeat.com — the consumer menu-recommendation app described in `MenuPick-Architecture-v2.md`. It defines the mark, wordmark, color, type, voice, and the rules that hold the system together as the product scales from MVP to native v1.5.

---

## 1. The idea behind the mark

pickyeat helps a diner *pick* the right thing to eat from any menu, anywhere. The brand has to feel like food (warm, appetizing, never sterile), feel local (India-first, but never costume-cliché), and feel smart (AI-powered, but never robotic).

The mark is two elements:

- **A bowl** — the universal shape of a meal. Simple, geometric, friendly. Saffron-orange, the appetite color, also a color that signals "Indian" without leaning on a flag, a paisley, or an om.
- **A mint dot above the bowl** — the *pick*. The selected option. The good idea that just landed. The pin on the map. The period in the URL. One single recurring motif.

That dot is the brand's load-bearing element. It appears on the bowl, on the wordmark, in the product UI as the "you should order this" highlight, and in the domain `pickyeat.com` as a colored period. Wherever a user sees a mint dot in our product, they should read it as *"we picked this for a reason."*

---

## 2. The mark

| Asset | File | Use |
| --- | --- | --- |
| Primary mark | `logo-mark.svg` | Default app, web, and social uses on light backgrounds |
| Knockout | `logo-knockout.svg` | Hero panels, social avatars, app-icon contexts on saffron |
| Monochrome | `logo-mono.svg` | Single-color print, embossing, watermarks |
| Favicon | `favicon.svg` | 16–64px browser tab |
| App icon | `app-icon.svg` | 1024×1024 master for iOS and Android export |
| Primary lockup | `logo-primary.svg` | Mark + wordmark, horizontal — default for most surfaces |
| Stacked lockup | `logo-stacked.svg` | Square placements (splash screens, posters, profile cards) |
| Wordmark | `wordmark.svg` | Type-only, where the mark is too small to be legible |

### Construction

The bowl is a flat half-disc 160 units wide × 80 units deep. The dot is a circle of radius 22 units, placed 44 units above the bowl rim and offset 48 units right of bowl center — the asymmetry gives the mark forward motion and prevents it reading as a generic emoji.

The minimum clear-space around the mark is half the bowl height on every side. Never crop, rotate, recolor outside the palette, or stretch.

### Sizing

- Favicon / 16px: use `favicon.svg` — the bowl-to-dot ratio is tuned for sub-pixel rendering at small sizes.
- 24–96px: use the primary mark.
- 96px+: use a lockup (primary or stacked).
- 1024px+: use `app-icon.svg` as the source for store exports.

### Misuse — the do-nots

- Do not fill the bowl with a different color and expect the dot to carry the brand alone.
- Do not place the dot on the bowl, inside the bowl, or touching the rim.
- Do not change the dot color from mint to red, blue, or any other accent — the dot is the brand.
- Do not add steam, sparkles, or AI shimmer effects. The mark earns its warmth from form, not decoration.

---

## 3. Color

Five colors. Two carry meaning, three are workhorses.

| Name | Hex | Role |
| --- | --- | --- |
| Saffron | `#F26B3A` | Primary brand color. Appetite, India warmth, default for the bowl and any "primary action" CTA. |
| Spice | `#C8421C` | Saffron's deeper sibling. Use for hover states, headlines on cream, and large display type that needs more density. |
| Sprig | `#2BB673` | The pick. Reserved for the dot motif and "good pick" UI states (selected dish, recommended badge, success). Never use for backgrounds. |
| Pepper | `#1F1B16` | Default text. Warm-black, never pure black — lets the cream surface breathe. |
| Coconut | `#FFF8EE` | Default surface. Warm-cream, never pure white — keeps the brand warm against any food photography. |

### Combinations that work

- Coconut surface + Pepper text + Saffron action + Sprig accent (default product UI)
- Saffron surface + Coconut text + Sprig accent (hero panels, app icon)
- Pepper surface + Coconut text + Saffron accent (dark mode, late-night use)

### Combinations to avoid

- Saffron + Sprig used at equal weight — they fight. Sprig is always small, always an accent.
- Pure white anywhere. We use Coconut.
- More than three brand colors visible in a single composition. Keep it edited.

---

## 4. Typography

| Tier | Family | Use |
| --- | --- | --- |
| Display + body (Latin) | Plus Jakarta Sans | Logos, headers, body. Geometric but humanist — feels modern and friendly. Falls back to Inter, then Helvetica Neue. |
| Indic | Mukta | Hindi, Marathi. Designed by Ek Type to pair with Plus Jakarta and Inter — same x-height, same geometric vibe, supports Devanagari natively. |

Two weights only: **400 regular** for body, **700 bold** for display. No italic. No condensed.

### Type scale (product UI)

| Use | Size | Weight | Tracking |
| --- | --- | --- | --- |
| H1 / hero | 30 px | 700 | -0.02 em |
| H2 / section | 22 px | 500 | -0.01 em |
| H3 / card | 17 px | 500 | 0 |
| Body | 15 px | 400 | 0 |
| Caption | 12 px | 400 | 0.02 em |
| Eyebrow / label | 11 px | 500 | 0.18 em uppercase |

### Production note on the wordmark

The wordmark in `logo-primary.svg`, `logo-stacked.svg`, and `wordmark.svg` currently uses live SVG `<text>` with a font-stack. This renders correctly when Plus Jakarta Sans or Inter are available, with `textLength` locking the visual width. **Before the brand ships in print, app-store assets, or merchandise, outline the wordmark to paths once a font is licensed** — that locks pixel-perfect kerning across systems. Until then, the live-text version is editable and good enough for digital surfaces.

---

## 5. Voice

We sound like the friend who's eaten there.

| Principle | What it means | Example |
| --- | --- | --- |
| Knowing, not knowing-it-all | Confident picks with reasons. No hedging, no listicles. | ✅ "Get the butter chicken — three reviews call it the best in Pune." ❌ "You might want to try a few options including..." |
| Warm without being cute | The food does the warmth. We do the clarity. | ✅ "47 picks here this month." ❌ "Yum! 🥘🔥 47 amazing dishes await! ✨" |
| Local, never touristy | India-first vocabulary. Translate outward, not inward. | ✅ "Thali · ₹240 · feeds one hungry person." ❌ "Indian platter · ₹240 · for a single diner." |

### Words we use

pick, order, scan, menu, dish, thali, tiffin, snack, feast, sweet, sharp, mild, fresh, real, nearby, today, just-cooked, crowd-favorite, pin, drop, save.

### Words we avoid

curated, AI-powered, leverage, journey, experience (as a verb), discover (as a verb), delight, delicious, mouth-watering, authentic, traditional, exotic. Most of these are used by every food app already and translate to nothing in the user's head.

### Tagline rotation

Three taglines, used in different contexts:

- **Scan. Pick. Eat.** — short-form, app store, packaging, hero.
- **Order what you'll actually love.** — long-form, paid social, landing pages.
- **The picky eater's secret weapon.** — playful, referrals, T-shirt.

---

## 6. The dot, in product

The mint dot is the brand's repeating motif. It earns its place by being the same dot, every time:

- on the **mark**, floating above the bowl
- in the **wordmark**, as the period at the end of "pickyeat."
- in the **domain lockup**, as the dot before "com" (`pickyeat·com`)
- in the **product UI**, as the highlight on a recommended dish
- on the **map**, as the pin head when GPS detects a restaurant
- on **dish photos**, as the corner indicator that says "verified by another diner"

If a UI element is meant to read as "we picked this," it gets the dot. Nothing else gets the dot. This is how the brand becomes recognizable without ever showing the wordmark.

---

## 7. Open decisions

The brand book locks the system. These remain to be decided as the product matures:

- **Photography** — should the brand commission food photography for hero use, or always crop from real user-uploaded dish photos? The strategic answer is *user photos always*, because that's the moat per the architecture doc. But hero panels for marketing may need styled shots. Decide before the first paid campaign.
- **Illustration style** — none yet. If illustration is needed beyond the mark, it should be flat, geometric, and use the five-color palette only. No watercolor, no doodle, no sketch.
- **Sound** — the app may eventually have a "pick-confirmed" sound. Should be a single soft mallet note, like a small bell, ~200 ms. Not yet recorded.
- **Motion** — the dot is the natural anchor. When the app shows a pick, the dot should *land* into position with a small bounce (200 ms ease-out) rather than fade in. This is to be specified in v1 motion guidelines.

---

## 8. File index

```
/brand
├── brand-guide.md          ← this file
├── brand-preview.html      ← visual reference page
├── logo-primary.svg        ← horizontal lockup
├── logo-stacked.svg        ← vertical lockup
├── logo-mark.svg           ← icon only
├── logo-knockout.svg       ← icon on saffron
├── logo-mono.svg           ← single-color
├── wordmark.svg            ← type only
├── app-icon.svg            ← 1024 source
└── favicon.svg             ← 16-64 px
```
