# pickyeat — Windows VPS deploy

Deploys the pickyeat Express backend to the existing GoDaddy Windows Server 2022 VPS at **148.66.156.102**, alongside the already-running SROS Cloud at xenios.in. **Zero changes to SROS.**

## Allocation summary

|                     | SROS (existing — untouched) | pickyeat (new)             |
|---------------------|-----------------------------|----------------------------|
| Folder              | `C:\sros-cloud\server\`     | `C:\pickyeat\server\`      |
| Node port           | `127.0.0.1:3002`            | `127.0.0.1:4000`           |
| pm2 process name    | `sros-cloud`                | `pickyeat-api`             |
| Public hostname     | `xenios.in`                 | `api.pickyeat.com`         |
| IIS site name       | (existing)                  | `pickyeat-api`             |
| SSL cert            | (existing)                  | Win-ACME, Let's Encrypt    |
| Windows Firewall    | (already open 80/443)       | (no new rules — reuses 443)|

## Prerequisites already present on the box (per SROS deploy)

- Node.js (running pm2 + SROS — version to be confirmed)
- pm2 (`C:\Users\gizmoadmin\AppData\Roaming\npm\pm2`)
- IIS + URL Rewrite + Application Request Routing (since SROS reverse-proxies through them)
- Public DNS A record for `xenios.in → 148.66.156.102` already works

## What you'll run (5 scripts, in order)

| # | Script             | What it does                                        | Risk     |
|---|--------------------|-----------------------------------------------------|----------|
| 1 | `01-discover.ps1`  | Read-only. Confirms Node/pm2/IIS versions, lists existing sites, lists pm2 processes. No changes. | None     |
| 2 | `02-prereqs.ps1`   | Installs only what's missing (Git, Win-ACME). Skips anything already present. | Low      |
| 3 | `03-deploy.ps1`    | `git clone` to `C:\pickyeat`, `npm ci`, `npm run build`, writes env file from a template, registers `pickyeat-api` pm2 process on port 4000. | Low — new files only |
| 4 | `04-iis-site.ps1`  | Adds a new IIS site `pickyeat-api` bound to `api.pickyeat.com:443` (SNI), reverse-proxies to `127.0.0.1:4000`. **Does not modify existing sites.** | Low      |
| 5 | `05-ssl.ps1`       | Win-ACME issues Let's Encrypt cert for `api.pickyeat.com`. **Requires the DNS A record at GoDaddy to be live first.** | Medium — only if cert challenge fails (will retry) |

## DNS steps you do at GoDaddy in parallel

Add to your `pickyeat.com` DNS:

```
A   api   148.66.156.102   600
```

That's the only DNS change. Wait until `nslookup api.pickyeat.com` resolves before running `05-ssl.ps1`.

## How to use

1. RDP into 148.66.156.102 (user: gizmoadmin)
2. Open **PowerShell as Administrator** (right-click Start → "Terminal (Admin)" or "Windows PowerShell (Admin)" — not CMD)
3. Copy this `vps/` folder onto the VPS, e.g. via Git clone or RDP file copy, to `C:\pickyeat\vps\`
4. `cd C:\pickyeat\vps`
5. Run scripts in order:

```powershell
.\01-discover.ps1                        # confirm baseline
.\02-prereqs.ps1                         # install missing tools
.\03-deploy.ps1                          # clone repo + start pm2
.\04-iis-site.ps1                        # add IIS site
# Add GoDaddy DNS, wait for propagation
.\05-ssl.ps1                             # Win-ACME SSL
```

Verify:

```powershell
Invoke-WebRequest https://api.pickyeat.com/health -UseBasicParsing
# expect: {"ok":true,"mode":"live","db":"configured"}
```

## Rollback (any step)

See `ROLLBACK.md`. tl;dr: `pm2 delete pickyeat-api`, `Remove-Website pickyeat-api`, delete `C:\pickyeat\`, revoke cert. SROS is never touched, so it keeps running through any rollback.

## What you'll need before running

- `secrets.env` (on your Mac, already populated with ANTHROPIC_API_KEY, GOOGLE_PLACES_API_KEY, DATABASE_URL). The `03-deploy.ps1` script will prompt you to paste each value, or you can copy `secrets.env` onto the VPS as `C:\pickyeat\server\.env` before running.
- The DNS A record at GoDaddy.
