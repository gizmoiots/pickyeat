# pickyeat -- Add IIS reverse proxy site for api.pickyeat.com
# Creates a NEW IIS site, never modifies existing ones (SROS at xenios.in stays untouched).
# Uses SNI so api.pickyeat.com can share port 443 with xenios.in.
#
# Usage: PowerShell as Administrator
#   cd C:\pickyeat\vps
#   .\04-iis-site.ps1

$ErrorActionPreference = 'Stop'
Import-Module WebAdministration

function Step($msg) { Write-Host "`n>> $msg" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "  [OK]   $msg" -ForegroundColor Green }

# -- Config -------------------------------------------------------------
$SITE_NAME   = 'pickyeat-api'
$HOSTNAME    = 'api.pickyeat.com'
$BACKEND_PORT = 4000
$SITE_ROOT   = 'C:\pickyeat\iis-root'   # empty folder -- IIS serves nothing from disk, only proxies
$WEB_CONFIG  = "$SITE_ROOT\web.config"

# -- 1. Refuse to overwrite existing pickyeat-api or any other site we'd collide with --
Step 'Pre-flight checks'
$existing = Get-Website -Name $SITE_NAME -ErrorAction SilentlyContinue
if ($existing) {
    throw "IIS site '$SITE_NAME' already exists. Delete first if you want a clean re-run:`n  Remove-Website -Name $SITE_NAME"
}

# Confirm SROS's site is present and we won't fight over hostnames
$srosSite = Get-Website | Where-Object { ($_.Bindings.Collection | ForEach-Object { $_.bindingInformation }) -match 'xenios.in' }
if ($srosSite) {
    Ok "found SROS site '$($srosSite.Name)' on xenios.in -- will not touch it"
} else {
    Write-Host '  Could NOT find an existing site for xenios.in. This is unexpected but not fatal -- continuing.' -ForegroundColor Yellow
}

# -- 2. Create empty site root + web.config with ARR reverse-proxy rule --
Step "Create site root at $SITE_ROOT"
New-Item -ItemType Directory -Path $SITE_ROOT -Force | Out-Null

# NOTE: use 'localhost' not '127.0.0.1' for the rewrite target -- on this
# Windows Server, ARR hangs on the IPv4 literal but works with 'localhost'.
# webSocket enabled + X-Forwarded-For mirror the working SROS site config.
$webConfigXml = @"
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <webSocket enabled="true" />
    <rewrite>
      <rules>
        <rule name="ReverseProxyToNode" stopProcessing="true">
          <match url="(.*)" />
          <action type="Rewrite" url="http://localhost:$BACKEND_PORT/{R:1}" />
          <serverVariables>
            <set name="HTTP_X_FORWARDED_PROTO" value="https" />
            <set name="HTTP_X_FORWARDED_FOR" value="{REMOTE_ADDR}" />
            <set name="HTTP_X_FORWARDED_HOST" value="{HTTP_HOST}" />
          </serverVariables>
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <requestLimits maxAllowedContentLength="20971520" />
      </requestFiltering>
    </security>
  </system.webServer>
</configuration>
"@
[IO.File]::WriteAllText($WEB_CONFIG, $webConfigXml)
Ok "web.config written"

# Allow rewrite to set server variables (one-time, server level -- same setting SROS already uses)
$allowed = (Get-WebConfiguration 'system.webServer/rewrite/allowedServerVariables' -PSPath 'MACHINE/WEBROOT/APPHOST').Collection | ForEach-Object { $_.name }
foreach ($v in 'HTTP_X_FORWARDED_HOST','HTTP_X_FORWARDED_PROTO','HTTP_X_FORWARDED_FOR') {
    if ($allowed -notcontains $v) {
        Add-WebConfiguration 'system.webServer/rewrite/allowedServerVariables' -PSPath 'MACHINE/WEBROOT/APPHOST' -Value @{ name = $v }
        Write-Host "  allowed server variable: $v"
    }
}

# -- 3a. Create a dedicated application pool first.
# New-Website does NOT auto-create one on every IIS version; without an app pool
# requests hang because there's no worker process to dispatch to.
Step "Create application pool $SITE_NAME"
if (-not (Get-Item "IIS:\AppPools\$SITE_NAME" -ErrorAction SilentlyContinue)) {
    New-WebAppPool -Name $SITE_NAME -Force | Out-Null
}
Set-ItemProperty "IIS:\AppPools\$SITE_NAME" -Name 'managedRuntimeVersion' -Value ''        # "No Managed Code"
Set-ItemProperty "IIS:\AppPools\$SITE_NAME" -Name 'startMode' -Value 'AlwaysRunning'
Ok "app pool '$SITE_NAME' ready (No Managed Code, AlwaysRunning)"

# -- 3b. Create the IIS site bound on HTTP only (port 80, hostname-scoped) --
Step "Create IIS site $SITE_NAME"
New-Website -Name $SITE_NAME `
            -PhysicalPath $SITE_ROOT `
            -HostHeader $HOSTNAME `
            -Port 80 `
            -IPAddress '*' `
            -ApplicationPool $SITE_NAME `
            -Force | Out-Null
Ok "site '$SITE_NAME' created (HTTP only -- SSL added in 05-ssl.ps1)"

# Start it (idempotent)
Start-Website -Name $SITE_NAME -ErrorAction SilentlyContinue
Ok "site started"

# -- 4. Sanity check ---------------------------------------------------
Step 'Local sanity check (HTTP)'
try {
    $r = Invoke-WebRequest -UseBasicParsing "http://127.0.0.1/health" -Headers @{ Host = $HOSTNAME } -TimeoutSec 5
    Write-Host "  HTTP /health via IIS => $($r.Content)"
    Ok 'IIS is reverse-proxying to node correctly'
} catch {
    Write-Host "  IIS proxy not yet working. Most likely causes:" -ForegroundColor Yellow
    Write-Host "    1. ARR proxy mode disabled (IIS Manager -> server -> App Request Routing Cache -> Server Proxy Settings -> check 'Enable proxy')"
    Write-Host "    2. node not running on 127.0.0.1:$BACKEND_PORT (check pm2 status: pm2 list)"
    throw $_
}

Write-Host "`nIIS site live (HTTP). Next: add GoDaddy DNS A record 'api -> 148.66.156.102', wait for propagation, then .\05-ssl.ps1" -ForegroundColor Green
