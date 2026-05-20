# MenuPick — Architecture v2

**Tagline (placeholder):** *Scan. Pick. Eat.*
**Form factor (committed):** PWA-first (Next.js + Tailwind), Capacitor-wrapped to native binaries in v1.5 for App Store / Play Store distribution
**Stack:** Next.js 14 PWA + Node/Express + PostgreSQL 16 + Claude API + Google Places API
**Audience:** B2C consumer, India-first (Pune launch)

> Changes from v1: PWA path locked. Added auth + profile. Added GPS restaurant detection as default entry point. Added Google Reviews → best-sellers. Expanded mood flow with health/macro/diet/allergen layers. Prioritized 25+ feature ideas across 10 categories.

---

## 1. The Updated User Journey

```
┌─────────────┐    ┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────┐
│ Open app    │ ──▶│ GPS check   │ ──▶│ Menu source  │ ──▶│ Pref flow   │ ──▶│ Picks +  │
│             │    │ Restaurant? │    │ (cache or    │    │ (Mood-first │    │ reasons  │
│             │    │             │    │  scan)       │    │ + Health)   │    │          │
└─────────────┘    └─────────────┘    └──────────────┘    └─────────────┘    └──────────┘
                          │                                                        │
                          │ "Cafe Mocha — 47                                       ▼
                          │ users scanned this                            ┌─────────────────┐
                          │ menu. Use saved?"                             │ I ordered this  │
                          ▼                                               │ Photo upload    │
                   ┌──────────────┐                                       │ Rate dishes     │
                   │ Yes → skip   │                                       │ → taste vector  │
                   │     scan     │                                       └─────────────────┘
                   └──────────────┘
```

**Time targets:**
- Cache hit (returning visitor at known restaurant): under 15 seconds from open to picks
- Cache miss (new restaurant or new menu): under 60 seconds end-to-end

---

## 2. Locked v1 Features (was v1 + new additions)

### 2.1 Auth & Profile
- **Anonymous-first:** every feature works without signup
- **Phone OTP signup** unlocks: history, taste vector, group invites, premium
- **Profile fields** (all optional):
  - Name, phone, optional age band
  - Dietary defaults (veg / jain / vegan / non-veg)
  - Allergens (multi-select: nuts / dairy / eggs / shellfish / soy / gluten)
  - Spice tolerance default
  - Health goals (none / cutting / maintaining / bulking)
  - Preferred language (English / Hindi / Marathi / + more)
- **Privacy controls:** "What we know about you" page, one-tap delete, no data sale

### 2.2 GPS Restaurant Detection (default entry point)
On app open, location permission check (graceful if denied — falls back to manual scan flow):

1. Get user's GPS
2. Query Google Places Nearby Search API → returns restaurants within 100m, sorted by distance
3. Match against `menus_cache` by `place_id`
4. **If cache hit:** show "*You're at Cafe Mocha. 47 users scanned this menu in the last 30 days.*" → "Use saved menu" / "Different place" / "Scan new menu"
5. **If cache miss:** show "*Looks like you're at Cafe Mocha. Want to scan their menu?*" → camera flow
6. **If multiple nearby:** show list, user picks (food courts, malls, mixed-use)

The first user at any new restaurant pays the scan cost. Every user after that gets the menu instantly.

### 2.3 Google Reviews → "Crowd Favorite" Badge
- On first scan, fetch Google Place Details (5 reviews, photos, ratings) via Places API — single call, ₹2-3, cached forever
- Run reviews through Claude with prompt to extract dish mentions + sentiment
- Match results back to scanned menu items (name fuzzy match)
- Surface a 🔥 **Crowd Favorite** badge on dishes mentioned positively
- Display review excerpt on tap: "*'Their butter chicken is unreal' — 3 reviews mention this*"
- Refresh review data every 30 days

### 2.4 Expanded Mood Flow

Existing flow stays (Mood → conditional follow-ups). New layers added:

**Always asked (1-2 questions):**
- *What are you craving?* — Drinks / Quick / Food / Full Meal *(unchanged)*
- Conditional follow-ups *(unchanged)*

**Optional toggles before "Show My Picks":**

| Toggle | Options |
|--------|---------|
| 🩺 Health mode | OFF (default) / ON → unlocks calorie + macro filters |
| 🌶️ Spice level | Mild / Medium / Hot / Any |
| 💰 Budget per dish | ≤₹150 / ≤₹300 / ≤₹500 / No limit |
| 🍽️ Hunger level | Just peckish / Normal / Starving |
| 🎉 Occasion | Solo / Date / Business / Family / Celebration |
| ⏰ Time of day | Auto-detected, override available |
| 🌧️ Weather mood | Auto from weather API + GPS |

**Health mode (when toggled on):**
- **Calorie target:** ≤300 / ≤500 / ≤800 / No limit
- **Macro focus:** High protein / Low carb / Balanced / Low fat / Any
- **Allergens to avoid:** multi-select (nuts / dairy / eggs / shellfish / soy / gluten)
- **Specific diet:** vegan / jain / gluten-free / halal / diabetic-friendly *(multi-select)*

Persistent in profile so they don't re-enter every scan.

**Estimation note:** Calorie/macro values are LLM-estimated from dish name + typical recipe, marked clearly as "*~estimate, ±20%*". Crowdsourced corrections improve accuracy over time.

### 2.5 Translate Mode 🔥
Toggle in scan flow: "*Show menu in English*". VLM does OCR + translation + picks in one pass. Killer for tourists, near-free since you're already calling vision.

### 2.6 Crowdsourced Dish Photos 🔥
After picks shown: "*Did you order something? Share a photo to help others.*" Optional, no friction. Real photos (not staged restaurant marketing) become massive value-add for visual previews. The moat builds itself.

### 2.7 Group Order Mode 🔥
- One user opens app, taps "*Order with friends*"
- Generates 4-digit code + share link
- 2-6 friends join from their phones (no install required — opens in browser)
- Each picks their prefs independently
- App finds dishes that satisfy the union of constraints + suggests sharing dishes that fit all
- Cost split shown automatically

The most viral mechanic — half the friends install the app to see their picks.

---

## 3. Updated Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      MOBILE CLIENT (PWA → Capacitor v1.5)                │
│  Camera • Image edit • GPS • Pref flow (Mood + Health) • Results UI      │
│  History • Group mode • Photo upload • Translate toggle                  │
└──────────────────────────────┬───────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                       API GATEWAY (Node/Express)                         │
│  /api/scan          /api/recommend       /api/menu/:place_id             │
│  /api/feedback      /api/auth/otp        /api/history                    │
│  /api/group/*       /api/photo           /api/places/nearby              │
└──┬────────────┬─────────────┬───────────────┬────────────────────────────┘
   │            │             │               │
   ▼            ▼             ▼               ▼
┌─────────┐ ┌──────────┐ ┌──────────┐  ┌────────────────────┐
│ Cache   │ │ Claude   │ │ Google   │  │ PostgreSQL         │
│ (pHash  │ │ Vision + │ │ Places   │  │ users, menus_cache │
│ + GPS   │ │ Text     │ │ API      │  │ scans, photos      │
│ index)  │ │ APIs     │ │          │  │ feedback, groups   │
└─────────┘ └──────────┘ └──────────┘  │ taste_vectors      │
                                        └────────────────────┘
                                        ┌────────────────────┐
                                        │ Object Storage     │
                                        │ (S3/R2)            │
                                        │ Dish photos only   │
                                        │ — never menu pics  │
                                        └────────────────────┘
```

---

## 4. Updated Data Model

```sql
-- Users with profile
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone           TEXT UNIQUE,
  name            TEXT,
  age_band        TEXT,                    -- '18-24', '25-34', etc.
  language        TEXT DEFAULT 'en',
  diet_default    TEXT,                    -- 'veg', 'nonveg', 'vegan', 'jain'
  allergens       TEXT[],                  -- ['nuts', 'dairy']
  spice_default   TEXT,                    -- 'mild', 'medium', 'hot'
  health_goal     TEXT,                    -- 'cutting', 'maintaining', 'bulking', null
  premium_until   TIMESTAMPTZ,             -- null = free user
  taste_vector    JSONB,                   -- learned preferences
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  consent_at      TIMESTAMPTZ              -- DPDP consent timestamp
);

-- Restaurants (linked to Google Places)
CREATE TABLE restaurants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_place_id TEXT UNIQUE,
  name            TEXT NOT NULL,
  address         TEXT,
  gps             POINT,
  google_rating   NUMERIC(2,1),
  google_review_count INT,
  cuisine_tags    TEXT[],
  bestsellers     JSONB,                   -- {dish_name: mention_count} from review analysis
  bestsellers_updated_at TIMESTAMPTZ,
  claimed_by      UUID REFERENCES users(id), -- for restaurant claim program
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON restaurants USING GIST(gps);

-- Menus cached by image hash + linked to restaurant
CREATE TABLE menus_cache (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_phash     TEXT,
  restaurant_id   UUID REFERENCES restaurants(id),
  parsed_menu     JSONB NOT NULL,          -- full structured menu w/ macros estimated
  scan_count      INT DEFAULT 1,
  first_seen_at   TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at    TIMESTAMPTZ DEFAULT NOW(),
  source          TEXT DEFAULT 'user_scan' -- 'user_scan' | 'restaurant_claim'
);

-- Each scan event
CREATE TABLE scans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  restaurant_id   UUID REFERENCES restaurants(id),
  menu_id         UUID REFERENCES menus_cache(id),
  prefs           JSONB NOT NULL,
  picks           JSONB NOT NULL,
  group_id        UUID,                    -- for group mode
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  gps             POINT
);

-- Feedback for taste learning
CREATE TABLE feedback (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id         UUID REFERENCES scans(id),
  user_id         UUID REFERENCES users(id),
  dish_name       TEXT,
  action          TEXT CHECK (action IN ('ordered','liked','disliked','skipped')),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Crowdsourced dish photos
CREATE TABLE dish_photos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID REFERENCES restaurants(id),
  dish_name       TEXT,
  user_id         UUID REFERENCES users(id),
  s3_key          TEXT NOT NULL,
  approved        BOOLEAN DEFAULT FALSE,   -- moderation queue
  upvotes         INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Group sessions
CREATE TABLE groups (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT UNIQUE,             -- 4-digit join code
  host_user_id    UUID REFERENCES users(id),
  restaurant_id   UUID REFERENCES restaurants(id),
  menu_id         UUID REFERENCES menus_cache(id),
  members         JSONB,                   -- array of {user_id|anon_id, name, prefs}
  combined_picks  JSONB,
  expires_at      TIMESTAMPTZ,             -- 2-hour TTL
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Feature Roadmap (Prioritized)

### MVP (3-4 weeks)
- ✅ Anon-mode scan + pick (no auth required)
- ✅ Mood-first preference flow (port from SROS)
- ✅ VLM-based scan + recommend (single Claude call)
- ✅ GPS restaurant detection
- ✅ Cache layer (image phash + GPS dedup)
- ✅ Translate mode (free with VLM)
- ✅ Phone OTP signup (optional)
- ✅ Basic profile (diet defaults, allergens)

### v1 (1-2 months after MVP)
- ✅ Health mode (calorie + macro + diet filters)
- ✅ Google Reviews → "Crowd Favorite" badge
- ✅ Scan history
- ✅ "I ordered this" feedback → taste vector v0
- ✅ Crowdsourced dish photos
- ✅ Restaurant detail screen (rating, hours, photos, top picks)
- ✅ Hindi + Marathi UI

### v1.5 (3-6 months)
- ✅ Group order mode
- ✅ Native iOS/Android via Capacitor → submit to stores
- ⚠️ **Premium tier pricing FRIDGED — see `design/monetization.md`.** New plan: ₹49/mo or ₹499/yr. Premium is no longer the primary revenue line; restaurant-side ladder (claim → featured → Xenios POS) is. Original premium pricing of ₹99-199/mo no longer in effect.
- ✅ Affiliate delivery integration (Zomato/Swiggy)
- ⚠️ **Restaurant claim program — see `design/restaurant-flow.md`** for the four-tier ladder (₹499 claim → ₹999 featured → ₹3-5K Xenios). Original flat ₹500-1000/mo replaced.
- ✅ Pairing recommendations *(moved to free tier per `monetization.md` §2)*
- ✅ "What is this dish?" explainers *(moved to free tier per `monetization.md` §2)*
- ✅ Macro counter / Google Fit + Apple Health sync *(premium retains this — `monetization.md` §2)*

### v2 (6-12 months)
- Network features: follow friends, see what they order
- Cuisine-first-timer guides
- Voice mode for prefs
- Advanced taste vector (embeddings-based)
- Currency overlay for tourists
- Dish pricing intelligence
- B2B data products (Pune trends report)
- Sponsored picks (carefully)

---

## 6. Master Brainstorm — All 25+ Feature Ideas Considered

🔥 = high impact, build for v1 ⭐ = solid, build for v1.5 💭 = exploratory, v2+

### Network Effects & Virality
- 🔥 Group order mode (4-digit code, friends join, union of prefs)
- 🔥 "What others ordered here today" — wisdom of crowd, anonymized
- ⭐ Send picks to friends via WhatsApp before ordering
- ⭐ Streak & badge gamification (cuisines explored, restaurants visited)
- 💭 Local food influencer mode (build dish lists, get followers)

### Personalization & Learning
- 🔥 Taste vector that learns silently from feedback
- ⭐ "You usually love X, try Y" — analog matching
- ⭐ Food bucket list — save dishes for later
- 💭 Mood diary — show users their own patterns

### Social & Community
- 🔥 Crowdsourced dish photos (real, not staged)
- ⭐ Dish-level reviews (per-dish, not per-restaurant)
- ⭐ Follow friends, see what they order
- 💭 Verified food reviewers / influencers

### Content & Education
- 🔥 "What is this dish?" — tap any unfamiliar item, get explanation
- ⭐ Pairing recommendations
- ⭐ Cuisine first-timer guides

### Tourism & Travel
- 🔥 Translate mode (point camera at any-language menu)
- ⭐ "Local favorites" mode — order what locals order, not tourists
- ⭐ Currency overlay for foreign visitors
- 💭 Travel mode auto-switch on far-from-home detection

### Health & Fitness
- 🔥 Macro counter (calorie + protein running total)
- ⭐ Allergen heat map (visual badges per dish)
- ⭐ Google Fit / Apple Health sync
- 💭 "Cheat day" mode — disable health filters for one meal

### Practical Utilities
- ⭐ Cost split for groups
- ⭐ Order time estimator
- ⭐ "I want something like this" — reverse image search a dish
- 💭 Voice mode — speak prefs

### Restaurant-Side Hooks (no cooperation needed)
- ⭐ Auto-detect handwritten specials boards
- ⭐ Price history tracking
- ⭐ "Last time you were here you ordered X" — repeat-visit memory

### Monetization Hooks
- 🔥 Affiliate delivery (Zomato/Swiggy partnership)
- 🔥 Restaurant claim program (₹500-1000/mo) — also feeds SROS leads
- ⭐ Premium subscription (₹99-199/mo)
- 💭 Sponsored picks (carefully labeled, only with verified restaurants)

### Data Products (year 2+)
- 💭 Pune Food Trends monthly report (sell to restaurants/journalists)
- 💭 Dish pricing intelligence by neighborhood

---

## 7. Privacy & DPDP Compliance

Adding auth + customer data raises the bar. Required design:

- **Explicit consent at signup** — clear what's stored, what's optional, what's used for what
- **"What we know about you"** screen — every field, every scan, every feedback event visible
- **One-tap delete** — wipes user, scans, feedback, photos. Cascade clean.
- **Data residency** — Postgres hosted in India region (DPDP requires for sensitive personal data)
- **No data sale** — codified in privacy policy, marketed publicly
- **Anonymized aggregations only** for any data products
- **Photo moderation** — dish photos go through AI moderation (no faces, no inappropriate content) before public display
- **GPS used only at moment of scan** — not background-tracked

This becomes a marketing edge: "*The food app that doesn't sell you out.*"

---

## 8. Critical Path Decisions Still Open

1. **Domain name + brand** (still TBD)
2. **Premium pricing** — ₹99 or ₹199/month? Price test with first 1,000 users
3. **Restaurant claim pricing** — ₹500 or ₹1,000/month? Probably tiered
4. **Native shell timing** — month 3 (after MVP traction proves) or month 6 (after v1)?
5. **Affiliate partnership priority** — Zomato or Swiggy first? Both have programs; Zomato has better API.
6. **Hosting** — your existing GoDaddy VPS (familiar, predictable cost) or Vercel + Railway (consumer-grade, scales)? **Recommend cloud since this is consumer scale, not single-cafe scale.**

---

## 9. Estimated Cost & Timeline

| Phase | Duration | Engineering effort | Monthly fixed cost | Per-scan variable cost |
|-------|----------|--------------------|--------------------|------------------------|
| MVP | 3-4 weeks | 1 person full-time | ₹3-5K (hosting) | ~₹3-5 cache miss, ₹0 cache hit |
| v1 | 4-6 weeks | 1 person FT + designer | ₹5-8K | ~₹1 average (caching dominates) |
| v1.5 | 8-10 weeks | 1-2 people | ₹10-15K | ~₹0.50 average |
| v2 | ongoing | 2-3 people | ₹25-50K | ~₹0.30 average |

**Break-even projection:** ~5,000 paying premium users at ₹99/mo = ₹5L/mo MRR, comfortably covers a small team + infra.

**1-day prototype (still recommended first step):** half-day of work, validates magic before any of this gets built. HTML file, hardcoded API key, take photo, call Claude vision, show picks. Test on 5-10 real Pune menus.

---

## 10. Funnel Synergy with SROS / Xenios

Worth flagging: this app feeds your B2B businesses indirectly.

- **MenuPick → SROS:** Restaurant claim program creates a paid touchpoint with cafe owners. After 6 months of "claim" relationship, conversation easily extends to "*Want a full POS that integrates with your menu listing here?*" Pre-qualified leads at scale.
- **MenuPick → Xenios:** Hotels and resorts with restaurants get the same funnel. Xenios pitch: "*Your restaurant menu is already in MenuPick — let's connect your full property.*"
- **Cross-promotion within MenuPick:** Verified-restaurant badges show "Powered by SROS" or "Xenios partner" — soft brand exposure to consumers.

This isn't a feature. It's a strategic alignment that makes the consumer app worth building even before it's profitable on its own — every restaurant relationship is a sales lead for the bigger businesses.
