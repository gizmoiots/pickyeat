# pickyeat — restaurant-side flow

Where the consumer app stops and the real business starts. This doc covers the restaurant lifecycle — how a café goes from "appears in pickyeat because diners scanned its menu" to "running Xenios POS that syncs to pickyeat automatically."

Companion to `monetization.md`. Codebase doesn't implement any of this yet — the existing `app/` is consumer-side only. This spec is what gets built next.

---

## 1. The four-tier ladder

```
Tier 0  →  Tier 1   →  Tier 2     →  Tier 3
Cached     Claimed     Featured       Xenios POS

free       ₹499/mo     ₹999/mo        ₹3-5K/mo
automatic  owner-      verified +     full POS +
           curated     priority       auto sync
```

A restaurant cannot skip tiers. Tier 1 is the gateway — claim, then upgrade. The 3-month free trial on Tier 1 is what gets restaurants onto the ladder cheaply; the value of dashboard analytics is what keeps them.

---

## 2. Tier 0 — Cached (free, automatic)

The default state for any restaurant a pickyeat user has scanned.

### How a restaurant enters Tier 0

- A user scans the menu (cache miss path).
- Backend stores: name, address, GPS, Google place_id, parsed menu JSON, scan count = 1.
- Subsequent scans of the same menu by other users increment scan_count.
- After 5+ scans in 30 days, the restaurant becomes a **lead** in the sales CRM.

### What the restaurant sees

Nothing. They don't know they're in pickyeat unless a diner tells them.

### What pickyeat shows users

- Restaurant detail page with name, address, Google rating, scan count ("47 picks this month")
- Picks from the cached menu
- Crowd-favorite badge on dishes extracted from Google Reviews
- **No "verified by owner" badge** — explicitly absent so the upsell to Tier 1 has visible value

### Cost to pickyeat

Per-scan Claude vision cost (~₹3-5 first scan, then free from cache). Negligible at scale because cache amortizes.

---

## 3. Tier 1 — Claimed (₹499/mo, 3 months free)

The first paid tier. Designed so the value is *immediately* visible in the first week.

### Acquisition motion

1. Restaurant hits 5+ scans in 30 days → flagged as a lead.
2. Cold outreach via WhatsApp or email to the owner:
   > *Namaste — 47 people scanned your menu on pickyeat in October. Here's what they wanted to order: [list]. You can claim your listing free for 3 months and see who's looking at your menu. — Nitin*
3. Owner clicks a one-time magic link → verifies phone OTP → claims the listing.

Conversion target: 8-12% of cold outreach in month 1, ramping to 20%+ once social proof from other claimed restaurants exists.

### What the restaurant gets

**Menu control**
- Edit dish names, prices, descriptions
- Add daily specials (visible to scanners for 24h)
- Mark dishes as "currently unavailable" (hides from picks)
- Upload official dish photos that override crowdsourced ones

**Analytics dashboard** (the killer feature at this tier)
- Scans per day, week, month — trend chart
- Top 10 dishes that pickyeat recommended last month
- Top 10 dishes that diners actually marked "I ordered this"
- Demographic breakdown (aggregated, anonymized): % veg/nonveg, top 3 dietary patterns, avg budget
- "What users searched for and didn't find on your menu" — gold for menu R&D

**Discoverability**
- Faster cache refresh (24h instead of 30 days)
- Owner's name shows on restaurant page ("managed by Priya R")

### What pickyeat charges

- **₹499/month** flat, or **₹4,990/year** (17% discount)
- First 3 months **free**, no credit card required
- After trial, monthly billing via UPI autopay or Razorpay

### What the restaurant doesn't get yet

- "Verified by owner" badge (Tier 2)
- Priority placement in nearby search (Tier 2)
- POS integration (Tier 3)

### Churn risk

The 3-month trial is long enough that owners build a habit (checking the dashboard weekly). The conversion-to-paid moment is when month 3 ends — expect ~50% churn at that gate. Of the 50% who pay, expect <5% monthly churn after.

---

## 4. Tier 2 — Featured (₹999/mo)

The "I want more diners to find me" upgrade. Sold as an add-on inside the Tier 1 dashboard after 60+ days of claimed activity.

### What unlocks

- **"Verified by owner" Sprig badge** on every dish card (subtle but visible)
- **Priority in nearby search** — when a diner opens pickyeat and GPS detects two nearby restaurants, featured one shows first
- **Curated dish photos** — owner can pin the official photo as the default; crowdsourced photos move to a gallery
- **Menu collections** — owner can group dishes into themes ("Sunday brunch", "Monsoon specials", "Vegan menu")
- **Featured dish slot** — one dish per day pinned at the top of the picks for diners who scan
- **Direct response to feedback** — when a diner rates a dish "disliked", owner can reply with a comp coupon or correction note
- **Custom social share image** — owner branding when a diner shares a pick

### What pickyeat charges

- **₹999/month** flat, or **₹9,990/year** (17% discount)
- No free trial — Tier 1 was the trial

### Sales motion

Inside the Tier 1 dashboard, a banner appears once the restaurant has 100+ scans/month:

> Your menu is one of the most-scanned in this area. Featured restaurants get 3× more "I ordered this" conversions. Try Featured free for 30 days.

The 30-day Tier 2 trial **does not include Tier 1's free trial reset**.

---

## 5. Tier 3 — Xenios POS (₹3,000–5,000/mo)

The endgame. Xenios is the existing POS product; pickyeat sells it into restaurants already on Tier 1 or Tier 2.

### What unlocks at Tier 3

Everything in Tier 2, plus:

- **Menu syncs automatically** from Xenios POS to pickyeat. Owner updates a price or dish in one place; both stay in sync.
- **Order routing** — when a diner taps "order this" in pickyeat, the order can route directly to the POS instead of (or in addition to) Zomato/Swiggy. Restaurant keeps 100% margin minus payment-processor fees.
- **Real-time stock** — dishes flagged as out-of-stock in the POS instantly disappear from pickyeat picks.
- **Kitchen display + KOT printing** — the actual POS features.
- **Inventory + recipe management** — restaurant-side, not visible to diners.
- **Daily sales reports** that combine pickyeat-attributed orders with walk-ins.

### Pricing

Tiered by seat count:

| Seats | Monthly | Yearly |
| --- | --- | --- |
| ≤30 (small café) | ₹3,000 | ₹30,000 |
| 31-80 (mid restaurant) | ₹4,000 | ₹40,000 |
| 80+ (large) | ₹5,000+ | quoted |

Setup: ₹2,000 one-time (waived if signing yearly).

### Sales motion

This is a real sales conversation, not a self-serve upgrade. After 6 months on Tier 1 or 2:

1. Account manager (you or a future hire) schedules a 30-min in-person demo at the restaurant.
2. Demo shows: same menu in pickyeat dashboard + Xenios kitchen view, with the "update once, syncs everywhere" pitch.
3. 14-day Xenios free trial alongside pickyeat — no risk to the owner.
4. Closing rate target: 25-30% of demoed restaurants in year 1, growing to 50%+ as case studies accumulate.

### Why Xenios is competitively defensible

Other POS in India sells "manage your kitchen." Xenios + pickyeat sells **"manage your kitchen AND get discovered by 1,000 nearby diners who already trust pickyeat to recommend your dishes."** Petpooja, Limetray, Rista — none of them have a consumer-side acquisition layer. To compete, they'd have to build pickyeat first.

---

## 6. Restaurant-facing app surface

Not yet built in the codebase. When it exists, it lives at `restaurants.pickyeat.com` — a separate Next.js app or a parallel route inside the existing one. Decided at build time.

### Screens needed for Tier 1

1. **Onboarding** — magic-link login → phone OTP verification → "this is your restaurant, right?" confirmation → 3-month trial starts
2. **Dashboard home** — scans this month + top dishes + "anything new this week?" feed
3. **Menu editor** — table view of all cached dishes, edit / delete / add / mark unavailable
4. **Specials manager** — add a 24-hour special with dish + price + photo
5. **Analytics** — charts for scans, picks-vs-orders, dietary breakdown
6. **Settings** — billing, owner profile, notification preferences

### Screens added for Tier 2

7. **Collections** — group dishes into themes
8. **Featured slot scheduler** — pick which dish appears at the top each day
9. **Feedback inbox** — see all diner feedback, reply with comp coupons
10. **Brand customization** — upload logo, choose social-share image style

### Screens added for Tier 3

11. **Xenios sync status** — live indicator showing last-sync time, any conflicts
12. **Order routing** — toggle which orders accept direct vs which go to delivery platforms
13. **Kitchen display** — the actual POS view (web-based, runs on a tablet in the kitchen)
14. **Recipes + inventory** — ingredient-level tracking with cost-per-dish

---

## 7. Data model additions

Builds on the existing schema in `app/backend/src/db/schema.sql`. Drop these tables in a v0.2 migration:

```sql
-- ── restaurant_owners ──
CREATE TABLE restaurant_owners (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  restaurant_id   UUID REFERENCES restaurants(id),
  role            TEXT CHECK (role IN ('owner','manager','staff')),
  tier            TEXT CHECK (tier IN ('claimed','featured','xenios')),
  trial_ends_at   TIMESTAMPTZ,
  billing_active  BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── restaurant_specials ──
CREATE TABLE restaurant_specials (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID REFERENCES restaurants(id),
  dish_name       TEXT NOT NULL,
  price_inr       INTEGER,
  description     TEXT,
  active_from     TIMESTAMPTZ DEFAULT NOW(),
  active_until    TIMESTAMPTZ,
  created_by      UUID REFERENCES users(id)
);

-- ── restaurant_collections ──
CREATE TABLE restaurant_collections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID REFERENCES restaurants(id),
  name            TEXT NOT NULL,
  dish_ids        TEXT[] DEFAULT '{}',
  display_order   INTEGER DEFAULT 0
);

-- ── billing_events ──
CREATE TABLE billing_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID REFERENCES restaurant_owners(id),
  kind            TEXT CHECK (kind IN ('trial_started','trial_ended','charged','refunded','churned')),
  amount_inr      INTEGER,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

Plus extending `restaurants` with `tier TEXT DEFAULT 'cached'` and `featured_until TIMESTAMPTZ`.

---

## 8. API endpoints

Net new on the backend:

```
GET    /api/owner/me                    current owner's restaurants
POST   /api/owner/claim                 claim a restaurant by place_id
GET    /api/owner/restaurants/:id/dashboard
GET    /api/owner/restaurants/:id/scans?from=&to=
GET    /api/owner/restaurants/:id/analytics
POST   /api/owner/restaurants/:id/menu  bulk update menu
POST   /api/owner/restaurants/:id/specials
POST   /api/owner/restaurants/:id/feedback/:id/reply

POST   /api/owner/billing/start-trial
POST   /api/owner/billing/upgrade       claimed → featured
POST   /api/owner/billing/checkout      Razorpay handoff
POST   /api/owner/billing/cancel
```

Authorization: every owner endpoint requires the session token to map to a `restaurant_owners` row for the requested restaurant_id.

---

## 9. KPIs by tier

Owner-side metrics, watched weekly:

| Tier | Metric | Healthy target |
| --- | --- | --- |
| 0 | Restaurants with 5+ scans/month | 200+ by end of year 1 |
| 0 → 1 | Cold outreach → claim rate | 8-12% in month 1, 20%+ by month 6 |
| 1 | Active claimed restaurants | 80+ by end of year 1 |
| 1 | Trial → paid conversion | 50% after 3 months |
| 1 | Monthly churn | <5% |
| 1 → 2 | Claim → Featured upgrade rate | 20% within 60 days of claim |
| 2 | Active featured restaurants | 15+ by end of year 1 |
| 2 → 3 | Featured → Xenios conversion | 10% within 6 months |
| 3 | Active Xenios customers | 10+ by end of year 1 |

---

## 10. What this means for the codebase

Build order, after the consumer MVP is live:

1. **Restaurant claim endpoint + magic-link auth** — the simplest possible "claim my restaurant" flow. Two new endpoints, one new page. ~1 week.
2. **Owner dashboard v0** — read-only analytics for Tier 1. ~2 weeks.
3. **Menu editor** — owner can edit cached dishes. ~1 week.
4. **Billing + Razorpay** — trial → paid conversion machinery. ~1 week.
5. **Featured tier UI** — collections, featured slot, feedback inbox. ~3 weeks.
6. **Xenios sync layer** — depends on the Xenios codebase's API surface; design once both teams converge. ~4-6 weeks.

Total: ~3 months of work after consumer MVP for the full restaurant-side stack. Tier 1 alone is ready in 4-6 weeks — enough to start cold outreach to the first 20 Pune restaurants.

---

## 11. Open questions

- **Should the restaurant-facing app share the same domain as consumer?** `pickyeat.com/owner` vs `restaurants.pickyeat.com`. Probably subdomain to keep the consumer experience clean.
- **WhatsApp Business API for outreach?** Probably yes — most café owners in India check WhatsApp before email. Adds setup work for the BSP.
- **Razorpay vs Stripe?** Razorpay for INR, UPI autopay, and lower fees. Stripe only if expanding outside India.
- **Xenios codebase status** — does Xenios have a documented API today, or does the sync layer require contributing back to that repo? Affects timeline materially. Worth a check-in with whoever maintains Xenios this week.
