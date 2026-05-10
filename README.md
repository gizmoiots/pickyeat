# pickyeat

Scan. Pick. Eat. — a B2C menu-recommendation PWA, India-first (Pune launch).

This repo holds everything: the architecture, the brand system, design references, and the working stack.

## Repo layout

```
pickyeat.com/
├── MenuPick-Architecture-v2.md   The product brief — read first
├── brand/                        Logo system, brand book, guideline assets
├── design/                       Stitch prompt + first-pass screen exports
└── app/                          The actual stack
    ├── frontend/                 Next.js 14 PWA (Tailwind, TypeScript)
    ├── backend/                  Express + TypeScript API gateway
    │   └── src/db/               Postgres schema + seed
    ├── docker-compose.yml        Local Postgres (one command)
    ├── README.md                 How to run it
    ├── DEPLOY.md                 How to ship it
    └── BUILD-VERIFIED.md         Last passing build run
```

## Quick links

- **Run it locally** → [`app/README.md`](./app/README.md)
- **Ship it to production** → [`app/DEPLOY.md`](./app/DEPLOY.md)
- **Brand identity** → [`brand/brand-guide.md`](./brand/brand-guide.md)
- **Architecture & decisions** → [`MenuPick-Architecture-v2.md`](./MenuPick-Architecture-v2.md)

## Status

- [x] Architecture doc locked (v2)
- [x] Brand identity v1.0
- [x] First-pass screens via Stitch
- [x] Frontend (Next.js, 12 screens, brand-wired)
- [x] Backend (Express, all `/api/*` endpoints, mock + live modes)
- [x] Postgres schema + seed
- [ ] Live Claude vision wired (TODO marked in `backend/src/services/claude.ts`)
- [ ] Live Google Places wired (TODO marked in `backend/src/services/places.ts`)
- [ ] Phone OTP auth (stubbed at `/api/auth/otp/*`)
- [ ] PWA service worker
- [ ] Deployed to `pickyeat.com`

## License

Proprietary — all rights reserved.
