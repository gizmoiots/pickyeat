# pickyeat — accounts + keys checklist

Open these five accounts in order. Each is free to start. Total time ~30-45 minutes. Copy each key/value into the table at the bottom — that becomes the env vars you paste into Railway.

---

## 1. Anthropic (Claude API) — the picks engine

**Sign up:** https://console.anthropic.com
**What to do:**
1. Sign up with email/Google
2. Settings → Plans & Billing → Add ₹2,000 credits (debit card / UPI works)
3. Settings → API Keys → Create Key → name it `pickyeat-prod` → copy the key (starts with `sk-ant-`)

**You'll get one value:**
- `ANTHROPIC_API_KEY=sk-ant-...`

**Cost:** ~₹3-5 per menu scan, ₹0.20 per recommendation. ₹2,000 covers ~500 first-time scans.

---

## 2. Google Cloud (Places API) — GPS restaurant detection

**Sign up:** https://console.cloud.google.com
**What to do:**
1. Sign up (free $200 credit for new accounts)
2. Create a new project named `pickyeat`
3. APIs & Services → Library → enable **Places API (New)** AND **Geocoding API**
4. APIs & Services → Credentials → Create Credentials → API key → copy
5. Restrict the key: Edit → Application restrictions → HTTP referrers → add `api.pickyeat.com/*` and `pickyeat.com/*`. API restrictions → restrict to Places + Geocoding only.

**You'll get one value:**
- `GOOGLE_PLACES_API_KEY=AIza...`

**Cost:** $200 free credit per month. Places Nearby Search costs $0.032 per call. Cache hits = ₹0. Easily fits the free tier for first 5,000 MAU.

---

## 3. Supabase (Postgres + Storage) — the database

**Sign up:** https://supabase.com
**What to do:**
1. Sign up with GitHub (uses your `gizmoiots` account)
2. New project → name `pickyeat-prod` → password (save it!) → Region: **Southeast Asia (Singapore)**
3. Wait ~2 minutes for provisioning
4. SQL Editor → paste contents of `app/backend/src/db/schema.sql` → run
5. SQL Editor → paste contents of `app/backend/src/db/seed.sql` → run
6. Project Settings → Database → Connection string → copy the URI (looks like `postgresql://postgres:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`)

**You'll get one value:**
- `DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`

**Cost:** Free tier — 500MB DB + 1GB storage. Enough for ~10,000 scans.

---

## 4. Railway (backend hosting)

**Sign up:** https://railway.app
**What to do:**
1. Sign up with GitHub (`gizmoiots`)
2. New Project → Deploy from GitHub repo → pick `gizmoiots/pickyeat`
3. Settings → Root Directory → set to `app/backend`
4. Variables → add ALL the env vars from the table at the bottom of this file
5. Settings → Networking → Generate Domain (get something like `pickyeat-backend-production.up.railway.app`)
6. Settings → Networking → Custom Domain → `api.pickyeat.com`
7. Railway shows a CNAME to add at GoDaddy. Add it: `api → [railway-target].up.railway.app`

**Cost:** $5/mo (₹420) after the free trial credit. First month often free.

After Railway is live: visit `https://api.pickyeat.com/health` — should return `{"ok":true,"mode":"live","db":"configured"}`.

---

## 5. MSG91 (phone OTP for India)

**Sign up:** https://control.msg91.com/signup
**What to do:**
1. Sign up — they'll ask for company name (use "pickyeat")
2. Verify your phone via OTP (irony)
3. Add ₹500 credits (UPI / card)
4. Sender ID → Request New → enter `PCKYET` → Use Case: "Transactional / OTP" → wait for DLT approval (24-48 hours in India)
5. Flow → Create Flow → template:
   ```
   Your pickyeat verification code is ##OTP##. Valid for 5 minutes.
   ```
6. Note the **Flow ID** (template_id) it generates
7. Settings → API Keys → copy your **Auth Key**

**You'll get three values:**
- `MSG91_AUTH_KEY=your-auth-key`
- `MSG91_TEMPLATE_ID=your-flow-id`
- `MSG91_SENDER_ID=PCKYET`

**Cost:** ~₹0.15-0.30 per OTP delivered. ₹500 covers ~2,000 signups.

**Workaround if MSG91 DLT approval is slow:** Keep `API_MODE=mock` until the sender ID is approved. The dev OTP "424242" works in mock mode for testing.

---

## 6. Final env vars to paste into Railway

Copy this entire block into Railway → Variables → "Raw Editor", replacing the placeholders:

```
PORT=4000
NODE_ENV=production
API_MODE=live

DATABASE_URL=postgresql://postgres.xxxxx:xxxxx@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

ANTHROPIC_API_KEY=sk-ant-xxxxx
ANTHROPIC_MODEL=claude-sonnet-4-6

GOOGLE_PLACES_API_KEY=AIzaxxxxx

MSG91_AUTH_KEY=xxxxx
MSG91_TEMPLATE_ID=xxxxx
MSG91_SENDER_ID=PCKYET

SENTRY_DSN=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
ZOMATO_AFFILIATE_CODE=PICKYEAT
SWIGGY_AFFILIATE_CODE=PICKYEAT
```

Sentry and Razorpay can stay empty for the soft launch — they have no-op fallbacks.

## 7. Frontend (Netlify) — flip to live mode

After Railway is up and `api.pickyeat.com` resolves:

Netlify → Project Configuration → Environment variables → update:

```
NEXT_PUBLIC_API_MODE=live
NEXT_PUBLIC_API_BASE=https://api.pickyeat.com
```

Then Netlify → Deploys → Trigger deploy → Clear cache and deploy site.

When that finishes, **pickyeat.com is fully real**: real GPS, real menu vision, real AI picks tuned to each user's prefs, real OTP signup, real database storage.

## 8. Verify end-to-end (5 min)

```bash
# DNS
dig +short api.pickyeat.com     # → Railway target

# Backend
curl https://api.pickyeat.com/health
# → {"ok":true,"mode":"live","db":"configured"}

# Recommend (anon, should return 3 picks)
curl -X POST https://api.pickyeat.com/api/recommend \
  -H 'content-type: application/json' \
  -d '{"prefs":{"spice":"medium","allergens":["peanuts"]}}'
```

Then on your phone, open `pickyeat.com`, click Allow location (real GPS), see your actual nearby restaurant, scan its menu with the camera. Three real picks back, written by Claude.

That's the moment.
