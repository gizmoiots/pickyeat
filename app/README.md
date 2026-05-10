# pickyeat — app

End-to-end stack for the menu-recommendation PWA described in `../MenuPick-Architecture-v2.md`. Brand assets live in `../brand/`. Stitch design references in `../design/`.

## Layout

```
app/
├── frontend/              Next.js 14 PWA (app router, TypeScript, Tailwind)
├── backend/               Express + TypeScript API gateway
│   └── src/db/
│       ├── schema.sql     Full Postgres schema (8 tables, indexes)
│       └── seed.sql       Cafe Mocha + sample dishes for demo
├── docker-compose.yml     One-command local Postgres
├── .env.example           All env vars across both services
└── README.md              You are here
```

## Quick start (local dev)

Prerequisites: Node 20+, Docker (or a local Postgres 16). The frontend works standalone in mock mode if you don't want to run the backend yet.

```bash
# 1. Install everything
cd frontend && npm install
cd ../backend && npm install

# 2. (optional) Bring up Postgres + run schema/seed
cd ..
docker compose up -d
docker compose exec db psql -U pickyeat -d pickyeat -f /docker-entrypoint-initdb.d/schema.sql
docker compose exec db psql -U pickyeat -d pickyeat -f /docker-entrypoint-initdb.d/seed.sql

# 3. Start the backend (port 4000)
cd backend
cp ../.env.example .env
npm run dev

# 4. Start the frontend (port 3000)
cd ../frontend
cp ../.env.example .env.local
npm run dev
```

Open http://localhost:3000 — you'll land on the splash screen, click "Allow location" to enter the demo flow.

## Mock mode vs live mode

The frontend reads `NEXT_PUBLIC_API_MODE`:

- `mock` — frontend uses local mock data from `lib/mockData.ts`, no backend needed. Use for design iteration, screenshots, demos.
- `live` — frontend hits the backend at `NEXT_PUBLIC_API_BASE`. Backend itself reads `API_MODE` and decides whether to call real Claude / Google Places or return its own mocks.

Both layers default to mock so the project boots clean from a fresh checkout.

## Wiring real APIs

When you're ready, fill in `.env`:

```
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_PLACES_API_KEY=AIza...
DATABASE_URL=postgres://pickyeat:pickyeat@localhost:5432/pickyeat
API_MODE=live
```

Then flip `NEXT_PUBLIC_API_MODE=live` and restart. The Claude wrapper at `backend/src/services/claude.ts` and Google Places wrapper at `backend/src/services/places.ts` are stubs with TODO markers showing where to drop in real calls.

## Deployment

Frontend → Vercel (set `NEXT_PUBLIC_API_BASE` to your backend URL).
Backend → Railway, Fly, or Render. Single Express process, talks to managed Postgres.
DB → Supabase / Neon / Railway Postgres. The schema is plain Postgres 16 with `gen_random_uuid()` and PostGIS-free spatial via the `point` type — no extensions required for MVP.

## Next steps

- [ ] Wire real Claude vision in `backend/src/services/claude.ts`
- [ ] Wire real Google Places in `backend/src/services/places.ts`
- [ ] Phone OTP auth (currently `/api/auth/otp` returns a stub session token)
- [ ] Image upload to S3/R2 for `dish_photos` (currently base64 in-memory)
- [ ] Phash-based menu cache lookup (currently restaurant-id only)
- [ ] PWA service worker for offline cache hits
