# pickyeat — monetization

This supersedes the pricing in `MenuPick-Architecture-v2.md` §5 (Premium tier ₹99-199/mo). The strategy has shifted from B2C-subscription-primary to **B2B-funnel-primary** with consumer subs as a small recurring line.

---

## 1. Strategic posture

The consumer app is a **funnel into restaurant sales**, not a SaaS business in its own right. Every scanned menu becomes a pre-qualified lead for the restaurant-side ladder (`restaurant-flow.md`) — claim program → featured → xenios POS.

This means consumer pricing is set to **maximize adoption**, not to maximize ARPU. ₹49/month is cheap enough that the decision is casual; the conversion rate doesn't need to be high; the user count does.

Revenue ranks roughly:

1. **Restaurant claim + featured tiers** (₹499–999 per restaurant per month)
2. **Xenios POS sales** (₹3K–5K+ per restaurant per month) — the real win, converted from claim relationships after 6 months
3. **Affiliate commission** on Zomato/Swiggy deep-links (1-3% of GMV)
4. **Consumer premium subscriptions** (₹49/month or ₹499/year)
5. **Sponsored picks** — only with verified-claim restaurants, only if it doesn't break trust (v2+)

If consumer premium contributes 10–15% of total revenue, the model is healthy. If it contributes >40%, we've under-priced the restaurant side.

---

## 2. Consumer tier carve-up

Three tiers. The free-signed-in middle tier is where most signup conversion happens — premium is a power-user upgrade on top.

### Free, anonymous (no signup, no friction)

The magic + safety baseline. Designed so a first-time Pune diner gets a working answer in <15 seconds without ever creating an account.

- GPS detect + menu scan + cache layer
- Mood picks (craving / spice / budget / occasion)
- **Diet filter** (veg / vegan / jain / nonveg) — one tap, anonymous
- **Allergen filter** (nuts / dairy / eggs / shellfish / soy / gluten) — one tap, anonymous, **never paywalled**
- Per-dish calorie + macro estimate visible on every pick
- Crowd-favorite badge from Google Reviews
- Translate mode (tourists)
- Pairing recommendations on the dish detail page
- "What is this dish?" explainer
- Cap: **5 scans per day** (the signup nudge)

### Free, signed-in (phone OTP, ₹0)

The conversion gate. Most signups happen here, not at the premium paywall.

- Everything free-anonymous, plus:
- Unlimited scans
- Scan history + saved menus
- Taste vector that learns from "I ordered this" feedback
- Group mode — host or join with the 4-digit code (up to 4 members)
- Submit dish photos (contributes to the shared moat)
- Saved favourites / bucket list
- Multi-device sync
- Cuisine first-timer guides

### Premium ₹49/mo OR ₹499/yr

Power users only. ₹499/yr = ~₹42/mo effective (≈15% discount) — yearly is the default option in the upsell screen.

- Everything free-signed-in, plus:
- Macro tracking — daily and weekly totals, charts, week-over-week deltas
- Apple Health / Google Fit / Fitbit sync
- Group mode for 5+ members
- "Find me a dish like X" — reverse search on the taste vector
- Restaurant predictions ("based on your last 30 picks, you'd love…")
- Ad-free (when ads exist)
- Early access to new features (beta channel)

### The signup nudge

When a free-anonymous user hits their daily scan cap:

> You've used 5 free scans today. Sign in with your phone — unlimited scans, no charge, and we remember what you liked.

Phone OTP is the only signup method. No email, no password. India-friendly, low friction, high deliverability through MSG91 or Twilio Verify (₹0.15-0.30 per OTP).

### The premium nudge

Surfaced only when the user has *already done the thing* the premium feature improves. Examples:

- After 5 dishes with macros visible: "Want a running total across the week?"
- After 4-person group order: "Add a 5th friend with pickyeat plus."
- After 10 picks rated: "Build your taste graph — see restaurant predictions tuned to you."

No interstitial paywalls. No "upgrade now" banners on the home screen. The pitch lands when the value is visible.

---

## 3. The "no allergen paywall" commitment

Two pieces of pickyeat's positioning are designed to be **competitor-resistant**:

- **"We don't sell you out"** — the privacy stance from the architecture doc (no data sale, India-region storage, one-tap delete).
- **"We don't paywall your allergy"** — the safety stance (allergen filter is free, anonymous, never gated).

Both are commitments that are easy to make and *hard for competitors to copy without setting them in print first.* Worth saying explicitly on the about page and in the app-store description.

---

## 4. Restaurant-side revenue (the main business)

Detail lives in `restaurant-flow.md`. Summary:

| Tier | Price | Unlocks |
| --- | --- | --- |
| **0 — Cached** | free | Restaurant appears with menu after 5+ user scans |
| **1 — Claimed** | ₹499/mo (free for first 3 months) | Owner verifies menu, controls accuracy, sees scan analytics |
| **2 — Featured** | ₹999/mo | "Verified by owner" badge, priority in nearby search, curated dish photos |
| **3 — Xenios POS** | ₹3,000–5,000/mo | Menu syncs automatically from POS to pickyeat; full POS for the kitchen |

The progression target: 30% of cached restaurants → Tier 1 within 6 months. 20% of Tier 1 → Tier 2 within 3 more months. 10% of Tier 2 → Tier 3 within 6 more months.

---

## 5. Revenue mix — end of year 1 target

Assumes 50,000 monthly active users, 500 restaurants in the cache, Pune launch only.

| Line | Customers | Avg | Monthly | Share |
| --- | --- | --- | --- | --- |
| Consumer premium | 1,500 @ 3% conv | ₹49 | ₹73K | 27% |
| Restaurant claim (Tier 1) | 80 | ₹499 | ₹40K | 15% |
| Restaurant featured (Tier 2) | 15 | ₹999 | ₹15K | 6% |
| Xenios POS (Tier 3) | 10 | ₹4,000 | ₹40K | 15% |
| Affiliate (Zomato + Swiggy) | — | 2% of ₹50L GMV | ₹100K | 37% |
| **Total** | | | **~₹2.7L/mo** | |

Notes on the projections:

- The **affiliate line** is the largest and most uncertain. Depends entirely on a partnership conversation with Zomato (better API) or Swiggy. Without it, total revenue is ~₹1.7L/mo — still positive given infra costs at this stage (~₹15K/mo per architecture doc §9).
- The **xenios line** is what makes pickyeat strategically valuable. 10 POS conversions in year 1 is conservative; if claim → POS conversion holds at 10%, we'd hit 30+ POS customers by month 18.
- **Consumer premium** is intentionally a smaller share than the architecture doc implied. At ₹49 the unit economics don't need it to be the headline.

---

## 6. Cross-funnel mechanics

The consumer app feeds the restaurant funnel in three ways. Worth being deliberate about each:

1. **Cache → cold outreach.** Once a restaurant has 5+ scans in 30 days, its details (name, address, scan count) go into the sales CRM. Outreach script: *"47 people scanned your menu on pickyeat last month. Here's what they tried to order. Want to manage it?"* (Conversion: ~5-10% in cold pilots.)

2. **Crowd photos → owner curation.** As users upload dish photos via the feedback loop, owners see their dishes appearing in pickyeat with user photos. Many owners will sign up just to curate / replace these. The photo moat doubles as a sales hook.

3. **Premium consumer data → owner dashboard.** Premium users opt in to share aggregate taste data ("38 of your scanners are bulking-focused; 22 want under ₹300"). This becomes the analytics view on the owner dashboard. Restaurants buy *because of* what the consumer app already knows.

---

## 7. Pricing tests planned

In order of priority:

1. **₹49 vs ₹79 monthly** — A/B with first 1,000 paying users. The hypothesis is that ₹79 doesn't materially hurt conversion if framed as "less than a chai a week."
2. **₹499 vs ₹399 yearly** — same A/B at the yearly tier. Yearly at ₹399 is a stronger gift-card / corporate-perk angle.
3. **Restaurant claim free trial length** — 3 months vs 1 month. Architecture doc said 3; worth testing 1 since most cafés decide in the first 30 days.
4. **Xenios POS pricing** — currently ₹3-5K. Test ₹3K floor, ₹6K ceiling for 50-100 seat restaurants vs 100+ seat.

Never A/B test the **scan cap** at 5/day for the anonymous tier — that's the only conversion lever that affects the public funnel shape. Move it once based on a clean analysis after month 3.

---

## 8. What's *not* monetized (deliberately)

- **Allergen filtering** — safety, never paywalled.
- **Diet filter** — basic utility for 30% of India, never paywalled.
- **Per-dish macro estimate** — Claude is already returning these on the scan; showing them is free.
- **Crowd-favorite badge** — built from public Google Reviews, free.
- **Translate mode** — tourist hook, free.
- **First scan at any restaurant** — anyone can scan any menu the first time without friction. Caching means subsequent scans are cheap for us.

The free product has to be *good enough* that an anonymous user trusts it and recommends it to friends. Paywalls go on **convenience and depth**, never on **safety or quality**.
