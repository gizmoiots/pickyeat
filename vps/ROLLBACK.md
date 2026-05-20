# pickyeat VPS — Rollback (zero impact on SROS)

If the deploy goes wrong at any step, follow these commands **in PowerShell as Administrator** on the VPS. They only touch pickyeat resources — SROS / xenios.in keeps running through any rollback.

## Full rollback (delete everything pickyeat-related)

```powershell
# 1. Stop + remove pm2 process
& "$env:APPDATA\npm\pm2.cmd" delete pickyeat-api
& "$env:APPDATA\npm\pm2.cmd" save

# 2. Remove IIS site (does NOT touch other sites)
Import-Module WebAdministration
Remove-Website -Name pickyeat-api -ErrorAction SilentlyContinue

# 3. Delete files
Remove-Item -Path C:\pickyeat -Recurse -Force -ErrorAction SilentlyContinue

# 4. Revoke Let's Encrypt cert (optional — certs auto-expire in 90 days)
$wacs = 'C:\Tools\win-acme\wacs.exe'   # or wherever it lives
& $wacs --revoke --host api.pickyeat.com
```

## Per-step rollback

### After 03-deploy.ps1 only
```powershell
& "$env:APPDATA\npm\pm2.cmd" delete pickyeat-api
Remove-Item C:\pickyeat -Recurse -Force
```

### After 04-iis-site.ps1
```powershell
Import-Module WebAdministration
Remove-Website -Name pickyeat-api
```
(Don't manually edit applicationHost.config — `Remove-Website` cleans up correctly.)

### After 05-ssl.ps1 (just remove HTTPS binding)
```powershell
Import-Module WebAdministration
Remove-WebBinding -Name pickyeat-api -Protocol https -Port 443 -HostHeader api.pickyeat.com
# cert in MY store can be cleaned later from certmgr.msc
```

## Things this rollback does NOT do

- Uninstall Node, Git, pm2, or Win-ACME (those are shared; SROS uses them too)
- Touch the `sros-cloud` pm2 process or `C:\sros-cloud\server\`
- Touch the IIS site bound to `xenios.in`
- Modify ARR / URL Rewrite server-level config (SROS depends on this)

## Sanity check after rollback

```powershell
# SROS should still be up:
Invoke-WebRequest https://xenios.in -UseBasicParsing | Select-Object StatusCode

# pickyeat should be gone:
& "$env:APPDATA\npm\pm2.cmd" list                                  # no pickyeat-api row
Get-Website pickyeat-api -ErrorAction SilentlyContinue             # nothing
Test-Path C:\pickyeat                                              # False
```
