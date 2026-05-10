# pickyeat — deployment guide

This is a step-by-step guide for taking the code in `app/` from your laptop to a live `https://pickyeat.com` that real users in Pune can install on their phones.

There are two recommended paths. Pick based on stage:

| Stage | Path | Monthly cost | DPDP-ready |
| --- | --- | --- | --- |
| MVP / first 1,000 users | **A. Managed cloud** (Vercel + Railway + Supabase) | ~₹0–1,200 | Partial — see §10 |
| Scale / India launch | **B. India-region** (Vercel + AWS Fargate + RDS Mumbai) | ~₹4,000–10,000 | Yes |

Path A gets you live in under an hour. Path B is what you migrate to when the user count or compliance bar demands it. Most of this guide walks Path A; §11 covers the migration to Path B.

---

## 1. What runs where

```
                    pickyeat.com (your domain)
                            │
              ┌─────────────┼──────────────┐
              ▼             ▼              ▼
        ┌──────────┐  ┌───────────┐  ┌───────────┐
        │ Vercel   │  │ Railway   │  │ Supabase  │
        │ frontend │──│ backend   │──│ Postgres  │
        │ (PWA)    │  │ (Express) │  │  + S3     │
        └──────────┘  └───────────┘  └───────────┘
              │             │              │
              └──── Anthropic API + Google Places API
```

- **Vercel** serves the Next.js PWA. Static assets at the edge, server components run in their serverless workers.
- **Railway** runs the Express container 24/7. It's the only piece with a persistent process.
- **Supabase** is your Postgres. Comes with auth, storage (for `dish_photos`), and a free tier that's generous for MVP.

---

## 2. Prerequisites

Local:
- Node 20+, Docker
- Git, GitHub account
- `app/` typechecks and runs locally (see `app/BUILD-VERIFIED.md` — already verified)

Accounts (all have a free tier — sign up before you start):
- [Vercel](https://vercel.com) · [Railway](https://railway.app) · [Supabase](https://supabase.com)
- [Anthropic Console](https://console.anthropic.com) for the Claude API key
- [Google Cloud Console](https://console.cloud.google.com) for the Places API key
- A domain registrar that holds `pickyeat.com` — you mentioned GoDaddy

---

## 3. Push the code to GitHub

Vercel and Railway both deploy from a Git repo, so this comes first.

```bash
cd /Users/nitin/Documents/Claude/Projects/pickyeat.com/app
git init
git add .
git commit -m "pickyeat — initial scaffold"

# create the repo on github.com (private), copy the URL, then:
git remote add origin git@github.com:YOUR_HANDLE/pickyeat.git
git branch -M main
git push -u origin main
```

Recommended layout: keep `frontend/` and `backend/` as siblings inside the same repo (monorepo). Both Vercel and Railway can deploy a subdirectory of a single repo.

---

## 4. Database — Supabase

Supabase gives you a Postgres instance, an S3-compatible object store for the dish photos, and built-in auth.

1. **Create a project.** New Project → name `pickyeat-prod` → password (save it) → region **Singapore (Southeast Asia)** for now. There's no Mumbai region yet — see §10 for DPDP context.
2. **Run the schema.** Open SQL Editor → paste the contents of `backend/src/db/schema.sql` → run.
3. **Run the seed (optional).** Same place, paste `backend/src/db/seed.sql`. Skip if you want a clean prod DB.
4. **Grab the connection string.** Project Settings → Database → Connection String → URI. Copy.
5. **Set up storage.** Storage → Create bucket → name `dish-photos`, public read OFF. We'll wire signed-URL uploads later.

Save these for the backend env:

```
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://[ref].supabase.co
SUPABASE_SERVICE_KEY=eyJh...   # service role key, not anon
```

---

## 5. Backend — Railway

1. **New project** → Deploy from GitHub repo → pick your `pickyeat` repo.
2. **Root directory**: `backend`.
3. **Build command**: `npm install && npm run build`.
4. **Start command**: `npm run start`.
5. **Environment variables** (Settings → Variables):

   ```
   PORT=4000
   API_MODE=live
   DATABASE_URL=...           # from Supabase
   ANTHROPIC_API_KEY=...      # from Anthropic Console
   GOOGLE_PLACES_API_KEY=...  # from Google Cloud
   ```

6. **Deploy.** Railway gives you a URL like `pickyeat-backend-production.up.railway.app`. Save it.
7. **Health check.** Visit `https://[your-railway-url]/health` — should return `{"ok":true,"mode":"live","db":"configured"}`. If `db: not-configured`, double-check `DATABASE_URL`.

The first deploy will fail if you haven't added the live Claude / Places code yet — that's fine, you can deploy with `API_MODE=mock` and flip to live once §8 is done.

---

## 6. Frontend — Vercel

1. **Add new project** → Import your `pickyeat` repo.
2. **Root directory**: `frontend`.
3. **Framework preset**: Next.js (auto-detected).
4. **Environment variables**:

   ```
   NEXT_PUBLIC_API_MODE=live
   NEXT_PUBLIC_API_BASE=https://pickyeat-backend-production.up.railway.app
   ```

5. **Deploy.** Vercel gives you `pickyeat.vercel.app`.
6. **Smoke test.** Open the URL, click through splash → detect → mood → picks. The picks screen makes a real call to your Railway backend; check the network tab to confirm.

---

## 7. Domain — pickyeat.com

You said the domain is on GoDaddy. Two records to add:

### Frontend (apex + www)

| Type | Host | Points to |
| --- | --- | --- |
| A | `@` | `76.76.21.21` (Vercel apex IP) |
| CNAME | `www` | `cname.vercel-dns.com` |

In Vercel: Project → Settings → Domains → Add `pickyeat.com` and `www.pickyeat.com`. Vercel will issue Let's Encrypt certificates automatically once DNS propagates (usually under 10 minutes).

### Backend (api subdomain)

| Type | Host | Points to |
| --- | --- | --- |
| CNAME | `api` | `pickyeat-backend-production.up.railway.app` |

In Railway: Settings → Networking → Custom Domain → `api.pickyeat.com`. Same Let's Encrypt automation.

Then update your Vercel env:

```
NEXT_PUBLIC_API_BASE=https://api.pickyeat.com
```

Redeploy. You're now at `https://pickyeat.com` talking to `https://api.pickyeat.com`.

---

## 8. Wire the live APIs

The backend currently returns mock data. Two wrappers need real implementations:

### 8a. Claude vision in `backend/src/services/claude.ts`

```bash
cd backend
npm install @anthropic-ai/sdk
```

Replace the `visionScanMenu` body:

```ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function visionScanMenu(imageBase64: string): Promise<Dish[]> {
  if (isMockMode()) return dishes;

  const r = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    messages: [{
      role: "user",
      content: [
        {
          type: "image",
          source: { type: "base64", media_type: "image/jpeg", data: imageBase64 }
        },
        {
          type: "text",
          text: `Extract every dish from this restaurant menu. Return JSON only, schema:
{ "dishes": [ { "id": "<slug>", "name": "<dish name>", "priceInr": <number>, "description": "<one line>", "estCalories": <number|null>, "allergens": ["dairy"|"gluten"|...], "diet": ["veg"|"vegan"|"jain"|null] } ] }

Be conservative on allergen tags — only mark known. Estimate calories from the dish name + typical recipe; mark as null if you can't.`
        }
      ]
    }]
  });

  const text = r.content[0].type === "text" ? r.content[0].text : "";
  const json = JSON.parse(text.match(/\{[\s\S]*\}/)![0]);
  return json.dishes;
}
```

Same pattern for `recommend()` — pass the parsed menu plus the user's prefs and ask Claude for three picks with reasons matching the brand voice ("matches your X + Y format").

### 8b. Google Places in `backend/src/services/places.ts`

```bash
npm install @googlemaps/google-maps-services-js
```

```ts
import { Client } from "@googlemaps/google-maps-services-js";
const client = new Client();

export async function nearbyRestaurants(lat: number, lng: number) {
  if (isMockMode()) return [cafeMocha];

  const r = await client.placesNearby({
    params: {
      location: { lat, lng },
      radius: 100,
      type: "restaurant",
      key: process.env.GOOGLE_PLACES_API_KEY!
    }
  });

  return r.data.results.map((p) => ({
    id: `rst_${p.place_id}`,
    googlePlaceId: p.place_id!,
    name: p.name!,
    address: p.vicinity ?? "",
    cuisineTags: p.types ?? [],
    googleRating: p.rating,
    googleReviewCount: p.user_ratings_total,
    scanCount: 0
  }));
}
```

After both are in, redeploy Railway with `API_MODE=live` and the Pune lat/lng demo flow becomes a real flow against real APIs.

---

## 9. Going-to-production checklist

Before you put `pickyeat.com` in front of real users:

**Functional**
- [ ] `npm run build` passes locally on both frontend and backend.
- [ ] All routes have an error boundary — at least a "something went wrong" fallback.
- [ ] `/api/health` returns 200 in live mode with `db: configured`.
- [ ] One real Pune restaurant menu has been scanned end-to-end and returned reasonable picks.
- [ ] OTP signup works against your real provider (MSG91 / Twilio Verify) — currently stubbed.

**Security**
- [ ] All `ANTHROPIC_API_KEY`, `GOOGLE_PLACES_API_KEY`, `DATABASE_URL` live ONLY in Railway/Vercel env vars, never in the repo.
- [ ] CORS in `backend/src/index.ts` is locked to `https://pickyeat.com` and `https://www.pickyeat.com` — currently it's `*`.
- [ ] Rate limit `/api/scan` and `/api/recommend` (express-rate-limit) — Claude calls cost real money.
- [ ] `dish_photos` upload runs through Claude vision moderation before flipping `approved=true`.
- [ ] HTTPS-only cookies for the eventual session token.

**Privacy / DPDP**
- [ ] Privacy policy page live at `/privacy` — covers what you store, where, and the deletion path.
- [ ] "What we know about you" screen ships with the working `Delete everything` link wired to a real cascade-delete API.
- [ ] Consent timestamp captured at signup (`users.consent_at`).
- [ ] No background GPS tracking — only at scan moment.

**Observability**
- [ ] Sentry on frontend and backend (free tier covers MVP).
- [ ] Vercel Analytics enabled.
- [ ] Railway logs piped to a long-term store (Better Stack / Logtail) — Railway only keeps 7 days.
- [ ] Synthetic uptime check on `/health` (UptimeRobot, free).

**Performance**
- [ ] Lighthouse score on `/` is ≥ 90 across the board on a 3G throttled run.
- [ ] PWA installs cleanly from Chrome on Android (manifest + icons in place).
- [ ] Cache-hit time-to-picks (`/detect` → `/picks`) is under 15 seconds end-to-end.
- [ ] Cache-miss time-to-picks is under 60 seconds (architecture target).

**Brand**
- [ ] Open Graph image at `/public/og.png` shows the lockup on Coconut.
- [ ] Favicon, app icon, and PWA icons all use the bowl + dot mark.
- [ ] Plus Jakarta Sans loads from the Google Fonts CDN and there's a system fallback (already configured in `globals.css`).

---

## 10. DPDP compliance — what's left

The Digital Personal Data Protection Act mandates that "sensitive personal data" of Indian residents lives on infrastructure within India. As of writing, Supabase doesn't have a Mumbai region — Singapore (`ap-southeast-1`) is closest.

This is fine for the MVP and the first ~1,000 users (the volume threshold for "significant data fiduciary" obligations is much higher). Plan to migrate to Path B before crossing 50,000 users or the first time a user files a regulatory complaint, whichever comes first.

What you can do today on Path A:

- **Pin storage to Singapore** (default). Don't accept Supabase's auto-region selection.
- **Document the data flow** — write down which fields leave India, why, and for how long. This goes in your privacy policy.
- **Anonymize before any data product** — the architecture doc's "Pune Food Trends report" must run on aggregated, k-anonymized data, never raw.
- **Encrypt at rest** — Supabase does this by default; verify in Project Settings → Database.

---

## 11. Migration to Path B (India-region)

When you outgrow the managed-services tier (or a regulator asks):

1. **Database** → migrate Postgres to AWS RDS in `ap-south-1` (Mumbai). Use `pg_dump` + restore. Update `DATABASE_URL` everywhere.
2. **Backend** → either:
   - **Easier**: Render's Singapore region (closer than the US, still not Mumbai).
   - **Right**: AWS Fargate or App Runner in `ap-south-1`. Containerize with `Dockerfile` (see `backend/Dockerfile.example` — yet to be added).
3. **Object storage** → migrate `dish_photos` from Supabase Storage to S3 in `ap-south-1`. Pre-signed PUT URLs for uploads.
4. **CDN** → Vercel already serves edge-cached assets from Bombay. No change needed unless you outgrow Vercel's bandwidth tier.

The frontend doesn't need to move — Vercel is fine for serving a PWA to Indian users from Bombay edge.

---

## 12. Costs at each stage

| Item | MVP (Path A) | Production (Path B) |
| --- | --- | --- |
| Vercel (frontend) | Free hobby tier — 100GB bandwidth, 1M edge requests | Pro $20/mo |
| Railway / Render / Fargate (backend) | Railway $5/mo after free credit | Fargate ~$30/mo (0.25 vCPU, 0.5GB) |
| Supabase / RDS (database) | Free 500MB | RDS db.t4g.micro Mumbai ~$15/mo |
| Anthropic API | Pay-per-call, ~₹3-5 per cache miss | same |
| Google Places API | $200/mo free credit | same |
| Domain | ₹800/yr | same |
| **Subtotal hosting** | **~₹0–1,200/mo** | **~₹4,000–10,000/mo** |
| **Variable per scan** | **₹0** cache hit, **₹3-5** cache miss | same |

The architecture doc's break-even projection (5,000 paying premium users × ₹99 = ₹5L/mo MRR) comfortably covers Path B plus a small team.

---

## 13. CI/CD

Both Vercel and Railway auto-deploy on push to `main`. Add a GitHub Action for typechecks before deploy:

```yaml
# .github/workflows/check.yml
name: typecheck
on: [push, pull_request]
jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: cd frontend && npm ci && npx tsc --noEmit && npx next build
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: cd backend && npm ci && npx tsc --noEmit
```

Make `main` a protected branch in GitHub: require this check to pass before merging. That stops a broken commit from auto-deploying to prod.

---

## 14. Day-1 launch playbook

1. **Soft launch**: invite ~20 friends, no marketing. Watch the Sentry feed and Railway logs for any errors. Fix and redeploy.
2. **First 100 users**: post in 2-3 Pune food groups (Reddit r/pune, Facebook food groups). Don't run paid ads yet.
3. **Restaurant claim** (architecture doc §6 monetization): once 5+ users have scanned the same restaurant, email the owner: "Your menu is in pickyeat. 47 users ordered from it last week. Claim it for ₹500/mo and lock the macros, add specials, hide your competitors' similar-to suggestions." That's also your first SROS lead.
4. **Premium**: after 1,000 free users, turn on the ₹99/mo paywall on the third scan of the day. Architecture doc says start at ₹99 and price-test with the first 1,000 paying users.

---

## 15. Things explicitly out of scope here

- iOS / Android native binaries via Capacitor — that's v1.5 per the architecture doc. The PWA installs to home screen on both platforms today, which is enough for MVP.
- Push notifications — needs FCM + APNs setup. v1.5.
- Affiliate delivery deep-links into Zomato/Swiggy — needs partnership applications. v1.5.
- B2B trends data product — v2.

If anything in this guide breaks on first run, the most common cause is an env var typo. `https://api.pickyeat.com/health` will tell you immediately whether the backend can see its database.
