# pickyeat.com — phase-wise launch plan

Aggressive, real-launch-focused. Built around what the codebase actually delivers today, what has to ship before the first user types in the URL, and what the architecture doc + monetization spec say happens after.

**Launch market:** Pune, India.
**Canonical domain:** `pickyeat.com`
**Redirects:** `pickyeat.in` → `pickyeat.com` (India variant), `pickeat.in` → `pickyeat.com` (typo catcher). All three owned. SEO-clean 301s configured via Vercel — see Phase 0 Day 2.
**Stack:** Next.js 14 PWA + Express + Postgres (Supabase) + Claude Vision + Google Places.
**Soft launch target:** Day 14.
**Public launch target:** Day 45.
**First profitable month:** Month 6-9.

---

## Phase 0 — Foundation (Days 1-7)

The goal of this week is **`pickyeat.in` resolves to a working website** showing the brand-correct PWA in mock mode. No real APIs yet, no users yet — just a real deployed URL we can show people.

| Day | Task | Status |
| --- | --- | --- |
| 1 | Domains already registered: `pickyeat.com` (canonical), `pickyeat.in`, `pickeat.in` ✓ | ✅ |
| 1 | Push code to private GitHub repo (`fix-and-push.sh` already drafted) | ⬜ |
| 2 | Deploy frontend to Vercel, point at `pickyeat.com` apex + www | ⬜ |
| 2 | Add `pickyeat.in` and `pickeat.in` to Vercel project — set both as "Redirect to pickyeat.com" (301 permanent) | ⬜ |
| 2 | Deploy backend to Railway, point at `api.pickyeat.com` | ⬜ |
| 3 | Spin up Supabase project in Singapore, run `schema.sql` + `seed.sql` | ⬜ |
| 3 | Set Sentry on both frontend and backend (free tier) | ⬜ |
| 4 | Write privacy policy + terms of service pages (legally required) | ⬜ |
| 4 | Set up UptimeRobot ping on `/health` | ⬜ |
| 5 | Generate all PWA icons (192, 512, maskable) from `brand/app-icon.svg` | ⬜ |
| 5 | Configure PWA service worker for offline cache-hit | ⬜ |
| 6 | Open Graph image at `/public/og.png` (lockup on Coconut) | ⬜ |
| 6 | Smoke test: open `pickyeat.in` on iPhone Safari, install to home screen | ⬜ |
| 7 | GitHub Actions CI workflow for typecheck + build on PR | ⬜ |

**Exit criteria for Phase 0:**

- `https://pickyeat.com` resolves and renders splash
- `https://pickyeat.in` and `https://pickeat.in` 301-redirect cleanly to `https://pickyeat.com` (verify in browser AND with `curl -I https://pickyeat.in`)
- Click-through from splash → detect → mood → picks works end-to-end in mock mode
- `https://api.pickyeat.com/health` returns `{"ok":true,"mode":"mock"}`
- PWA installable to iPhone and Android home screens
- Sentry catching frontend and backend errors
- One legal page each (privacy + terms) at `/privacy` and `/terms`

---

## Phase 1 — Real magic (Days 8-14)

The first time pickyeat scans an *actual* Pune restaurant menu and returns real picks. This is the moment the architecture doc has been pointing at since day one — "the 1-day prototype against a real menu."

| Day | Task |
| --- | --- |
| 8 | Get Anthropic API key (console.anthropic.com) — fund ₹2,000 credit |
| 8 | Wire `backend/src/services/claude.ts` visionScanMenu — real call |
| 9 | Wire `backend/src/services/claude.ts` recommend — real call with brand-voice system prompt |
| 9 | Get Google Places API key — enable Places + Geocoding APIs |
| 10 | Wire `backend/src/services/places.ts` — nearbyRestaurants + placeDetails |
| 10 | Implement Stage 1 hard filter (`design/algorithm.md` §3) — pure TS |
| 11 | Implement Stage 3 output shaping (algorithm.md §5) — pure TS |
| 11 | Add 3-second timeout + crowd-favorite fallback to Stage 2 |
| 12 | Flip `API_MODE=live` on Railway, redeploy |
| 12 | **Test against 5 real Pune menus:** Vaishali, German Bakery, Cafe Goodluck, Sweet Home, Le Plaisir |
| 13 | Fix whatever breaks. Tune brand-voice prompt based on actual reason quality |
| 14 | Rate limit `/api/scan` and `/api/recommend` (express-rate-limit, 20/hour anon) |

**Exit criteria for Phase 1:**

- Scanning a real menu photo at FC Road returns 3 picks with reasons that sound like a Pune local wrote them
- Allergen hard-filter verified: simulate a "no peanuts" user and confirm peanut dishes never appear
- Cost per scan logged: should be ~₹3-5 cache miss, ₹0 cache hit
- One full demo loop fits inside 30 seconds (cache miss) or 12 seconds (cache hit)

---

## Phase 2 — Soft launch with 20 friends (Days 15-21)

Hand-picked Pune diners. Not a marketing push — a controlled stress test.

**The 20:** mix of demographics that mirrors the target audience. Recommended split:

- 4 vegetarians (test diet filter path)
- 2 with declared food allergies (test allergen hard filter)
- 3 health-tracking gym-goers (test calorie + macro features)
- 3 couples / date-night users (test occasion mood)
- 3 frequent eaters-out (most-loyal-user candidates)
- 3 tourists or non-locals (test translate mode)
- 2 non-tech-savvy older users (test the friction floor)

**What you do that week:**

- Day 15: WhatsApp message to all 20 with the install link, the test mission, a Google Form for feedback
- Day 16-20: ask each to scan one menu per meal, share their picks via the group
- Day 18: mid-week call with 3 of them — ask what surprised, what annoyed, what they'd tell a friend about it
- Day 21: triage all feedback into 3 buckets: "fix before public", "fix in week 4", "v2 idea"

**Goal:** 100 successful scans across the 20 users, zero allergic incidents, zero data leaks.

---

## Phase 3 — Pune community launch (Days 22-35) — ~100 users

The first public toe in the water. Still no paid marketing — organic only.

**Channels (in priority order):**

1. **Reddit r/pune** — single post with a screenshot of a real pick at a recognizable spot ("47 picks at Vaishali this week — here's what the app recommended for a Sunday brunch"). Tone: useful, not promotional. Expect 30-60% of week 3 signups from this.
2. **Pune Foodies Facebook group** + 2 adjacent groups. Same post format. Reply patiently to every comment for 48 hours.
3. **Personal Instagram** — short reel of the GPS-detect → mood → picks loop at a known cafe. The "no signup needed" angle is the hook.
4. **WhatsApp Status** — yours and the original 20 friends'. Free, India-native, high conversion.

**What ships during this phase:**

| Day | Task |
| --- | --- |
| 22 | Activate Google Places review scraping → bestsellers JSON populated for top 50 Pune restaurants |
| 24 | Crowd-favorite badge live on picks based on real review data |
| 26 | First restaurant claim outreach: cold-WhatsApp 10 cafés on FC Road and Koregaon Park |
| 28 | Restaurant claim landing page: `pickyeat.in/owners` with single CTA "Claim your menu" |
| 30 | First analytics dashboard MVP for claimed restaurants (read-only — scans, top dishes, dietary breakdown) |
| 32 | Razorpay account set up (for restaurant billing later, not user-side) |
| 35 | First mid-launch review: scan count, restaurant funnel, what broke, what to fix |

**Goal:**
- 100 monthly active users
- 5 claimed restaurants (free trial)
- 250+ scans completed
- ≤ 2 stars: 0% (any 2-star feedback gets a personal WhatsApp follow-up within 24h)

---

## Phase 4 — Restaurant sales push (Days 36-60) — ~500 users

Two things happen in parallel: consumer growth keeps compounding from word-of-mouth, AND the first real B2B revenue comes online.

### Consumer side (organic continued)

- One blog post per week on `pickyeat.in/blog`: "The 5 cafes in Pune locals actually love" / "What 200 Pune diners ordered this week" — SEO + sharing fuel
- WhatsApp invite mechanic: "share pickyeat with a friend, both of you get an unlimited-scan week"
- App icon submit: at this point start the iOS Capacitor build for App Store submission (review takes 1-2 weeks, time it for Phase 5)

### Restaurant side (active sales)

This is the new work. Build order, all from `design/restaurant-flow.md`:

| Day | Task |
| --- | --- |
| 36 | Owner magic-link auth (Email or WhatsApp OTP → session token) |
| 38 | Owner dashboard v0: scans this month + top 10 picked dishes + dietary breakdown |
| 42 | Menu editor: owner can edit/delete/add dishes, mark unavailable |
| 45 | Specials manager: 24-hour daily-special slot |
| 48 | Razorpay subscription wiring for Tier 1 (₹499/mo or free 3-month trial) |
| 50 | Launch outreach campaign #2: WhatsApp 50 more cafés across all Pune (not just FC Road / KP) |
| 55 | First featured-tier upgrade conversation (₹999/mo) with the most engaged Tier 1 restaurant |
| 60 | Phase 4 review: paid restaurants, MRR, churn, consumer growth rate |

**Goal:**
- 500 monthly active users
- 20 claimed restaurants (60 outreach × 33% conversion)
- First 1-2 featured-tier upgrades
- ~₹10-15K MRR from restaurants
- 1,500+ scans / month

---

## Phase 5 — Auth + Premium tier (Days 61-90) — ~2K users

Now the consumer side becomes a real product with retention features and a monetization layer.

| Day | Task |
| --- | --- |
| 61 | Phone OTP integration via MSG91 (₹0.15/OTP — cheapest reliable India provider) |
| 64 | "Sign in with phone" gate after 5 anon scans/day |
| 67 | Scan history screen — accessible only when signed in |
| 70 | Saved favourites / bucket list — accessible only when signed in |
| 73 | Premium tier paywall: ₹49/mo or ₹499/yr, Razorpay UPI autopay |
| 75 | Macro tracking: daily + weekly totals with charts (Recharts) |
| 78 | Taste vector v0 (string summary from feedback events) |
| 80 | Premium nudge: surface after the 10th rated pick — "Want a running protein total across the week?" |
| 83 | Apple Health basic export (CSV download for now — full sync is later) |
| 85 | Capacitor iOS submission to App Store review |
| 90 | Phase 5 review |

**Goal:**
- 2,000 monthly active users
- 100 signed-in users (5% of MAU)
- 30-60 premium subscribers (3% of signed-in × Phase 4 momentum)
- ~₹2-3K MRR from premium
- ~₹25-30K MRR from restaurants (50 claimed, 5 featured)
- Total: ~₹30K MRR

---

## Phase 6 — Group mode + Affiliate (Days 91-150) — ~5K users

The viral mechanic plus the largest single revenue line.

### Group mode launch

The architecture doc's "most viral mechanic." Half of new free users come through group invites that don't require an install.

| Day | Task |
| --- | --- |
| 91 | Group host flow (already coded — wire to backend) |
| 93 | Group join URL: `pickyeat.in/g/4827` opens in browser, prefs entered there, no install required |
| 95 | Union-of-constraints algorithm (algorithm.md §9) |
| 97 | Split-the-order fallback UI |
| 100 | Cost-split-among-members display |
| 105 | Test with 3 real friend groups in Pune — refine based on what breaks socially |

### Affiliate deep-links

Largest variance, largest potential line per `monetization.md` §5. Conversation has to start now because partnerships take 60-90 days to wire.

| Day | Task |
| --- | --- |
| 91 | Cold outreach to Zomato Partner team (referral commission program) |
| 95 | Parallel outreach to Swiggy (they're more flexible on terms, sometimes) |
| 110 | Wire deep-link from dish detail screen → Zomato / Swiggy with affiliate code |
| 120 | Track conversion: pickyeat tap → completed delivery order |
| 135 | First affiliate payout (typical T+30 from order completion) |

**Goal:**
- 5,000 monthly active users
- 200 group-mode sessions / month (organic viral coefficient working)
- ~₹10-15K MRR from affiliate (ramping)
- ~₹50-60K MRR from restaurants (100 claimed, 15 featured, 5 Tier 3 conversations open)
- ~₹6-8K MRR from premium (150 paying users)
- Total: ~₹75-85K MRR

iOS App Store approval expected during this phase — flip the install gate from "Add to home screen" to "Download on the App Store" once live.

---

## Phase 7 — Xenios POS first install (Days 151-210) — ~10K users

This is the strategic milestone. **The first restaurant that buys Xenios specifically because pickyeat already lives in their workflow.**

| Day | Task |
| --- | --- |
| 151 | Identify 3 Tier 2 (featured) restaurants with the highest pickyeat scan→order conversion |
| 155 | In-person demo at each (you + the Xenios pitch deck) |
| 165 | First Xenios trial — 14 days, free, on the most enthusiastic restaurant |
| 175 | Menu auto-sync layer built: Xenios POS → pickyeat menu updates in real-time |
| 185 | First Xenios paid month closes — ₹3-5K from this single account |
| 200 | Second and third Xenios conversions in progress |
| 210 | Phase 7 review — what makes Xenios sell vs not |

**Goal:**
- 10,000 monthly active users
- 200+ claimed restaurants
- 30+ featured
- **3-5 Xenios paying accounts** (~₹15K MRR from POS line alone)
- Total: ~₹1.2-1.5L MRR — **first profitable month** if team is 1-2 people

---

## Phase 8 — Beyond launch (Month 8+)

Strategic options open up at this scale. Pick one to two, not all:

1. **Mumbai expansion** — replicate Pune playbook with 200 restaurants pre-cached before announcing
2. **Bangalore expansion** — bigger market, more tech-savvy users, faster growth potential
3. **Deep in Pune** — push for 1,000+ restaurants and 50K MAU before expanding (more defensible)
4. **B2B trends data product** — sell "Pune Food Trends" report to journalists, restaurants, FMCG (~₹50K-2L per report)
5. **Influencer claim program** — paid food bloggers get a verified badge + commission on referred users
6. **Capacitor Android Play Store submission** — only if PWA install rate plateaus

---

## What this plan *won't* do (deliberate omissions)

- **No paid ads in the first 90 days.** Word-of-mouth in Pune is real and free. Paid ads only after organic CAC is understood.
- **No Hindi/Marathi UI in Phase 1-3.** Cognitive load on a one-person team. Ship it in Phase 5 once English version is stable.
- **No native iOS/Android in MVP.** PWA installs to home screen are good enough for the first 5K users. Native is a v1.5 polish.
- **No analytics SaaS in Phase 0-3.** Vercel Analytics + Sentry is enough. Mixpanel / Amplitude only when you have specific funnel hypotheses to test.
- **No fundraise pitch for Phase 1-5.** Bootstrap to MRR first. The deck is much stronger with 100 paying restaurants than with a deck.

---

## Risk-and-fallback matrix

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| Claude API costs scale faster than revenue | Medium | Cache hit rate >70% by Phase 3; cap free anon at 5 scans/day to control burn |
| Restaurant outreach conversion under 5% | Low-Med | Switch from cold WhatsApp to in-person walk-ins on FC Road one Saturday |
| Privacy regulator complaint | Low | Privacy policy + India-region storage + one-tap delete are all live by Phase 0 |
| Allergic incident from a pick | Very low (hard filter blocks) | Insurance policy ₹5-10K/yr from Acko / Digit for app-product liability |
| Zomato shuts the affiliate door | Medium | Swiggy backup conversation runs in parallel from Day 91 |
| Stitch / brand drift creeps back into code | Medium | Brand book + iteration log enforced via PR review; no merging brand-divergent UI |
| Hosting bill spikes beyond ₹5K/mo before Phase 5 | Low | Vercel + Railway + Supabase free tiers cover 5K MAU comfortably |
| Solo-founder burnout | Real | Hard rule: one full day off per week, no Slack notifications after 9pm |

---

## What I'd commit to right now if I were you

If today is Day 0, the decisions to make in the next 4 hours:

1. ~~**Pick the domain**~~ — done. `pickyeat.com` canonical, `pickyeat.in` + `pickeat.in` as 301 redirects via Vercel.
2. **Open accounts** — Vercel, Railway, Supabase, Anthropic Console, Google Cloud Console, GitHub, Razorpay, MSG91. All free to start. Sign up tonight.
3. **Push to GitHub** — run `./scripts/fix-and-push.sh` tonight; the repo is the source of truth from now on
4. **Block one weekend** — the 1-day prototype test (Phase 1 Day 12) is what de-risks everything. Block a Saturday in week 2 for it.

If those four happen this week, soft launch on Day 14 is fully on the table.

---

## Appendix — Domain & redirect setup

You own three domains. The DNS setup for the canonical-plus-redirects pattern:

### Canonical: `pickyeat.com` → Vercel

In your registrar's DNS panel for `pickyeat.com`:

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |
| CNAME | `api` | `pickyeat-backend-production.up.railway.app` |

In Vercel project → Settings → Domains:
- Add `pickyeat.com` — set as **Primary domain**
- Add `www.pickyeat.com` — set as **Redirect to pickyeat.com**

In Railway project → Settings → Networking:
- Add custom domain `api.pickyeat.com`

Wait 5-15 minutes for DNS propagation. Let's Encrypt certificates issue automatically.

### Redirect: `pickyeat.in` → `pickyeat.com`

Two options. Both work; #1 is recommended.

**Option 1 (recommended) — redirect via Vercel:**

DNS for `pickyeat.in`:

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

In Vercel → Settings → Domains:
- Add `pickyeat.in` — set as **Redirect to pickyeat.com** (301 permanent, preserve path)
- Add `www.pickyeat.in` — same redirect

**Why this beats registrar-level forwarding:** Vercel issues a real Let's Encrypt cert for `pickyeat.in` (no SSL warning on the redirect), preserves the full path (so `pickyeat.in/owners` → `pickyeat.com/owners` instead of dumping to home), and returns a clean 301 that search engines consolidate to the canonical domain.

**Option 2 — registrar-level forwarding:**

In GoDaddy: Domain settings → Forwarding → Add forwarding → Forward to `https://pickyeat.com` → 301 permanent → with masking OFF → save. Simpler to set up but no SSL on the source URL (`https://pickyeat.in` will fail), no path preservation, no SEO consolidation.

### Redirect: `pickeat.in` → `pickyeat.com`

Same as `pickyeat.in` Option 1. Add as a third domain in Vercel, set to "Redirect to pickyeat.com" with path preservation.

### Verify

After DNS propagates (~10 minutes), run these from any terminal:

```bash
curl -I https://pickyeat.com         # 200 OK, served by Vercel
curl -I https://pickyeat.in          # 301 → https://pickyeat.com
curl -I https://pickeat.in           # 301 → https://pickyeat.com
curl -I https://www.pickyeat.com     # 301 → https://pickyeat.com
curl -I https://api.pickyeat.com/health   # 200 OK, served by Railway
```

All three top-level domains should land users on `https://pickyeat.com` with a green padlock and no SSL warnings.

### Brand-adjacent things to lock down this week

Now that the canonical is `pickyeat.com`, claim the matching identities before someone else does:

- **Email** — set up `hello@pickyeat.com` and `owners@pickyeat.com` via Google Workspace (₹150/user/month) or Zoho Mail (free for 5 users)
- **Instagram, X/Twitter, LinkedIn, YouTube** — claim @pickyeat or @pickyeatapp on all four. Even if you don't post, the handles are squatter-vulnerable.
- **Reddit** — u/pickyeat for community engagement
- **WhatsApp Business** — register the business profile under "pickyeat" (verification takes 1-2 weeks; start now)
- **Trademark search** — run a free preliminary check on tmrsearch.ipindia.gov.in for "pickyeat" in classes 9 (software) and 43 (food services). Filing costs ~₹4,500 across both classes; not urgent until paid marketing starts in Phase 4
- **App Store / Play Store developer accounts** — Apple ₹8K/yr, Google ₹2K one-time. Register both this month so iOS submission in Phase 5 isn't gated by account approval delays
- **Razorpay business verification** — needs the .com domain on the registration; using the canonical here saves a reapplication later
