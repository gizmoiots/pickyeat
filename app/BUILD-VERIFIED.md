# build verification — 2026-05-08

Both halves of the stack typecheck and run cleanly in the sandbox.

## Frontend — Next.js 14

```
✓ tsc --noEmit                  → 0 errors
✓ next build                    → Compiled successfully
✓ Generating static pages (12/12)
```

All 12 screens pre-render: splash, detect, scan, mood, toggles, health, picks, dish/[id], feedback/[id], profile, group, restaurant/[id].

## Backend — Express + TypeScript

```
✓ tsc --noEmit                  → 0 errors
✓ tsx src/index.ts              → boots on :4000 in mock mode

GET  /health
  → {"ok":true,"mode":"mock","db":"not-configured"}

POST /api/recommend
  body: {"prefs":{"spice":"medium"}}
  → [{dish:..., reason:"matches your high-protein goal + 3 reviews call it the best in Pune"}, ...]

GET  /api/group/4827
  → {id, code:"4827", members:[Aarav, Maya, Jordan, Sasha], ...}
```

## What "verified" does NOT mean yet

- Postgres schema not exercised end-to-end — `docker compose up && backend with API_MODE=live` is the next test.
- Real Claude vision call not made — the wrapper at `backend/src/services/claude.ts` returns mocks until the API key lands.
- Real Google Places call not made — same pattern.
- PWA service worker not registered (manifest is in place; SW is a v1.5 task per the architecture doc).
