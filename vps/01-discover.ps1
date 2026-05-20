# pickyeat -- VPS Discovery (READ-ONLY)
# Confirms what's already on the Windows VPS so the pickyeat deploy can plan around SROS.
# Makes NO changes. Safe to run any time.
#
# Usage: open PowerShell as Administrator, then:
#   cd C:\pickyeat\vps
#   .\01-discover.ps1
#
# IMPORTANT: PowerShell, not CMD. The C:\Users\gizmoadmin> prompt is CMD.
# Right-click Start -> "Terminal (Admin)" or "Windows PowerShell (Admin)".

$ErrorActionPreference = 'Continue'  # don't bail on missing tools, we WANT to see what's missing

function Section($name) {
    Write-Host "`n=== $name ===" -ForegroundColor Cyan
}

function Ok($msg)    { Write-Host "  [OK]   $msg" -ForegroundColor Green }
function Warn($msg)  { Write-Host "  [WARN] $msg" -ForegroundColor Yellow }
function Info($msg)  { Write-Host "  $msg" }
function Bad($msg)   { Write-Host "  [MISS] $msg" -ForegroundColor Red }

# --- OS ---
Section 'Operating system'
$os = (Get-CimInstance Win32_OperatingSystem)
Info "$($os.Caption) -- $($os.Version)"

# --- Public IP ---
Section 'Public IP'
try {
    $ip = (Invoke-WebRequest -UseBasicParsing https://ifconfig.me -TimeoutSec 5).Content.Trim()
    Info $ip
    if ($ip -eq '148.66.156.102') { Ok 'matches expected VPS IP' } else { Warn "expected 148.66.156.102 -- verify this is the right box" }
} catch { Warn "could not reach ifconfig.me -- check internet" }

# --- Node / npm / pm2 ---
Section 'Node, npm, pm2'
$nodeVer = & node -v 2>$null
if ($nodeVer) { Ok "node $nodeVer" } else { Bad 'node not installed -- pickyeat needs node >= 20' }

$npmVer = & npm -v 2>$null
if ($npmVer) { Ok "npm $npmVer" } else { Bad 'npm not installed' }

$pm2Path = "$env:APPDATA\npm\pm2.cmd"
if (Test-Path $pm2Path) {
    Ok "pm2 found at $pm2Path"
    & $pm2Path list 2>&1 | Out-String | Write-Host
} else {
    Bad 'pm2 not at expected location -- SROS uses pm2 so this should exist'
}

# --- Git ---
Section 'Git'
$gitVer = & git --version 2>$null
if ($gitVer) { Ok $gitVer } else { Bad 'git not installed -- needed for `git clone` of pickyeat repo' }

# --- IIS ---
Section 'IIS'
try {
    Import-Module WebAdministration -ErrorAction Stop
    Ok 'WebAdministration module loaded -- IIS is installed'

    $sites = Get-Website
    Info "Existing sites: $($sites.Count)"
    foreach ($s in $sites) {
        Info "  * $($s.Name)  [$($s.State)]  -> $($s.PhysicalPath)"
        foreach ($b in $s.Bindings.Collection) {
            Info "      binding: $($b.protocol) $($b.bindingInformation)"
        }
    }

    if ($sites.Name -contains 'pickyeat-api') {
        Warn 'IIS site "pickyeat-api" already exists -- 04-iis-site.ps1 will refuse to overwrite. Delete it first if you want a clean re-run.'
    }
} catch {
    Bad 'WebAdministration module not available -- IIS not installed?'
}

# --- URL Rewrite + ARR ---
Section 'URL Rewrite + ARR (required for IIS reverse proxy)'
$urlRewrite = Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\IIS Extensions\URL Rewrite' -ErrorAction SilentlyContinue
if ($urlRewrite) { Ok "URL Rewrite $($urlRewrite.Version)" } else { Bad 'URL Rewrite missing -- install IIS URL Rewrite Module' }

$arr = Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\IIS Extensions\Application Request Routing' -ErrorAction SilentlyContinue
if ($arr) { Ok "ARR $($arr.Version)" } else { Bad 'Application Request Routing missing -- install IIS ARR' }

# Check ARR proxy is enabled
try {
    $proxyEnabled = (Get-WebConfigurationProperty `
        -PSPath 'MACHINE/WEBROOT/APPHOST' `
        -Filter 'system.webServer/proxy' `
        -Name 'enabled' -ErrorAction Stop).Value
    if ($proxyEnabled) { Ok 'ARR proxy mode: enabled (good -- SROS relies on this)' }
    else { Warn 'ARR proxy mode: DISABLED -- enable in IIS Manager -> server node -> Application Request Routing Cache -> Server Proxy Settings -> check "Enable proxy"' }
} catch { Warn "could not read ARR proxy state: $_" }

# --- Win-ACME ---
Section 'Win-ACME (Let''s Encrypt for Windows)'
$wacsPaths = @(
    "$env:ProgramFiles\win-acme\wacs.exe",
    "$env:ProgramFiles(x86)\win-acme\wacs.exe",
    "C:\win-acme\wacs.exe",
    "C:\Tools\win-acme\wacs.exe"
) | Where-Object { Test-Path $_ }
if ($wacsPaths) {
    Ok "Win-ACME found at $($wacsPaths[0])"
} else {
    Bad 'Win-ACME not found -- 02-prereqs.ps1 will download it. (SROS might use a different cert tool -- check before adding a second one.)'
}

# --- Listening ports ---
Section 'Ports'
Info 'Listening on 80, 443, 3002, 4000:'
$listens = netstat -ano | Select-String -Pattern ':80\s|:443\s|:3002\s|:4000\s' | Select-String -Pattern 'LISTENING'
$listens | ForEach-Object { Info "  $_" }

if ($listens -match ':4000\s.*LISTENING') {
    Bad 'Port 4000 is already in use -- pickyeat needs 4000. Pick a different port or stop the conflict.'
} else { Ok 'port 4000 is free' }

# --- Disk ---
Section 'Disk free on C:'
$free = [math]::Round((Get-PSDrive C).Free / 1GB, 1)
Info "$free GB free"
if ($free -lt 5) { Bad 'less than 5 GB free -- node_modules alone is ~500MB, build artifacts add more' }
else { Ok 'enough headroom for the deploy' }

# --- DNS check (no changes, just lookup) ---
Section 'DNS for api.pickyeat.com'
try {
    $rec = Resolve-DnsName api.pickyeat.com -Type A -ErrorAction Stop
    $a = $rec | Where-Object { $_.QueryType -eq 'A' } | Select-Object -First 1
    if ($a -and $a.IPAddress -eq '148.66.156.102') {
        Ok "api.pickyeat.com -> $($a.IPAddress) (correct)"
    } elseif ($a) {
        Warn "api.pickyeat.com -> $($a.IPAddress) (NOT this box -- fix GoDaddy DNS before running 05-ssl.ps1)"
    } else {
        Warn 'no A record yet -- add at GoDaddy: A "api" -> 148.66.156.102'
    }
} catch {
    Warn "api.pickyeat.com does not resolve yet -- add A record at GoDaddy, then re-run this script"
}

# --- pickyeat folder ---
Section 'pickyeat folder'
if (Test-Path 'C:\pickyeat\server') {
    Warn 'C:\pickyeat\server already exists -- 03-deploy.ps1 will refuse to overwrite. Delete it for a clean re-run.'
} else { Ok 'C:\pickyeat\server does not exist -- ready for fresh clone' }

# --- Summary ---
Section 'Summary'
Write-Host @'
Run results above carefully. Then:
  - If anything is [MISS]: run 02-prereqs.ps1 next
  - If everything is [OK]: skip to 03-deploy.ps1
  - DNS warning is fine for now -- fix at GoDaddy before 05-ssl.ps1
  - Port 4000 conflict needs manual resolution before continuing
'@
