# pickyeat -- Issue Let's Encrypt SSL for api.pickyeat.com via Win-ACME
# Adds an HTTPS binding to the existing pickyeat-api IIS site. Does not touch SROS or xenios.in.
#
# REQUIREMENT: DNS A record api.pickyeat.com -> 148.66.156.102 must already resolve.
# Win-ACME uses the http-01 challenge, which means Let's Encrypt will hit
#   http://api.pickyeat.com/.well-known/acme-challenge/...
# That must land on our IIS site (port 80) which it will, once DNS is right.
#
# Usage: PowerShell as Administrator
#   cd C:\pickyeat\vps
#   .\05-ssl.ps1

$ErrorActionPreference = 'Stop'

function Step($msg) { Write-Host "`n>> $msg" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "  [OK]   $msg" -ForegroundColor Green }

$HOSTNAME = 'api.pickyeat.com'
$SITE_NAME = 'pickyeat-api'

# -- 1. Pre-flight: DNS must resolve to this box -----------------------
Step "DNS pre-flight for $HOSTNAME"
try {
    $rec = Resolve-DnsName $HOSTNAME -Type A -ErrorAction Stop
    $resolved = ($rec | Where-Object QueryType -eq 'A' | Select-Object -First 1).IPAddress
    Write-Host "  resolves to: $resolved"
    if ($resolved -ne '148.66.156.102') {
        throw "DNS for $HOSTNAME points to $resolved, not 148.66.156.102. Fix the GoDaddy A record and wait 5-15 min, then retry."
    }
    Ok 'DNS correct'
} catch {
    throw "DNS for $HOSTNAME not resolving yet: $_"
}

# -- 2. Locate Win-ACME ------------------------------------------------
Step 'Locate Win-ACME'
$wacs = @(
    "$env:ProgramFiles\win-acme\wacs.exe",
    'C:\Tools\win-acme\wacs.exe'
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $wacs) { throw 'Win-ACME not installed. Run 02-prereqs.ps1 first.' }
Ok "using $wacs"

# -- 3. Run Win-ACME in unattended mode --------------------------------
Step 'Request Let''s Encrypt cert + bind to IIS site'
# Win-ACME args:
#   --target manual --host api.pickyeat.com         (specify exact hostname)
#   --installation iis --installationsiteid <ID>     (bind to our IIS site)
#   --accepttos                                       (accept Let's Encrypt ToS)
#   --emailaddress nitin.solanke@gmail.com            (cert renewal notices)

Import-Module WebAdministration
$siteId = (Get-Website -Name $SITE_NAME).ID

& $wacs --target manual --host $HOSTNAME `
        --installation iis --installationsiteid $siteId `
        --accepttos --emailaddress 'nitin.solanke@gmail.com'

if ($LASTEXITCODE -ne 0) {
    throw "Win-ACME failed (exit $LASTEXITCODE). Common causes: port 80 blocked from outside, IIS site not started, DNS not resolved."
}
Ok 'Let''s Encrypt cert issued + bound'

# -- 4. Verify HTTPS works ---------------------------------------------
Step 'Verify HTTPS'
Start-Sleep -Seconds 2
try {
    $r = Invoke-WebRequest -UseBasicParsing "https://$HOSTNAME/health" -TimeoutSec 10
    Write-Host "  https://$HOSTNAME/health => $($r.Content)"
    Ok 'pickyeat backend is live over HTTPS'
} catch {
    Write-Host "  HTTPS check failed: $_" -ForegroundColor Yellow
    Write-Host "  Try manually:" -ForegroundColor Yellow
    Write-Host "    Invoke-WebRequest https://$HOSTNAME/health -UseBasicParsing" -ForegroundColor Yellow
    throw
}

Write-Host @"

Deploy complete.

Now flip the frontend to live mode:
  Netlify -> Project -> Site configuration -> Environment variables -> set:
    NEXT_PUBLIC_API_MODE = live
    NEXT_PUBLIC_API_BASE = https://$HOSTNAME
  -> Deploys -> Trigger deploy -> Clear cache and deploy site

Then restrict the Google Places API key to source IP 148.66.156.102 in the
Google Cloud Console (the script can't do this -- manual step).

Final verification:
  curl https://$HOSTNAME/health
  curl -X POST https://$HOSTNAME/api/recommend -H 'content-type: application/json' \\
    -d '{"prefs":{"spice":"medium","allergens":["peanuts"]}}'

"@ -ForegroundColor Green
