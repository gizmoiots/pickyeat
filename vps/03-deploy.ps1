# pickyeat — Deploy the Node backend to C:\pickyeat\server
# Clones the GitHub repo, installs deps, builds TypeScript, registers a pm2 process on 127.0.0.1:4000.
# Does NOT touch SROS, IIS, or any existing services.
#
# Usage: PowerShell as Administrator
#   cd C:\pickyeat\vps
#   .\03-deploy.ps1

$ErrorActionPreference = 'Stop'

function Step($msg) { Write-Host "`n>> $msg" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "  [OK]   $msg" -ForegroundColor Green }

# ── Config ────────────────────────────────────────────────────────────
$REPO        = 'https://github.com/gizmoiots/pickyeat.git'
$INSTALL_DIR = 'C:\pickyeat'
$APP_DIR     = "$INSTALL_DIR\app\backend"        # the Express backend in the monorepo
$PM2_NAME    = 'pickyeat-api'
$PORT        = 4000
$ENV_FILE    = "$APP_DIR\.env"
$PM2         = "$env:APPDATA\npm\pm2.cmd"

# ── 1. Clone (or refuse if folder already exists, to be safe) ────────
Step "Clone repo to $INSTALL_DIR"
if (Test-Path $INSTALL_DIR) {
    if (Test-Path "$INSTALL_DIR\.git") {
        Write-Host "  $INSTALL_DIR already a git repo — pulling latest" -ForegroundColor Yellow
        Push-Location $INSTALL_DIR
        & git fetch --all
        & git reset --hard origin/main
        Pop-Location
    } else {
        throw "$INSTALL_DIR exists but isn't a git checkout. Move it aside or delete it, then re-run."
    }
} else {
    & git clone $REPO $INSTALL_DIR
    Ok 'cloned'
}

# ── 2. Install deps + build ─────────────────────────────────────────
Step "Install + build backend at $APP_DIR"
Push-Location $APP_DIR
& npm ci --include=dev
& npm run build
Pop-Location
Ok 'build complete'

# ── 3. Write .env (prompts if not already there) ────────────────────
Step 'Write .env'
if (-not (Test-Path $ENV_FILE)) {
    Write-Host '  No .env found. You can either:'
    Write-Host '    A) Cancel now (Ctrl+C), copy your secrets.env from Mac to' $ENV_FILE ', then re-run'
    Write-Host '    B) Paste each value now (will not echo)'
    Write-Host ''
    $choice = Read-Host '  Pick A or B'
    if ($choice -eq 'A') { throw 'Aborted — copy .env then re-run.' }

    function Ask($label, [switch]$secure) {
        if ($secure) {
            $s = Read-Host "  $label" -AsSecureString
            return [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($s))
        }
        Read-Host "  $label"
    }

    $anthropicKey = Ask 'ANTHROPIC_API_KEY (sk-ant-...)' -secure
    $googleKey    = Ask 'GOOGLE_PLACES_API_KEY (AIza...)' -secure
    $dbUrl        = Ask 'DATABASE_URL (postgresql://...)' -secure
    $msg91Key     = Ask 'MSG91_AUTH_KEY (leave empty if not yet)'
    $msg91Tpl     = Ask 'MSG91_TEMPLATE_ID (leave empty if not yet)'

    $env_body = @"
PORT=$PORT
NODE_ENV=production
API_MODE=live

DATABASE_URL=$dbUrl

ANTHROPIC_API_KEY=$anthropicKey
ANTHROPIC_MODEL=claude-sonnet-4-6

GOOGLE_PLACES_API_KEY=$googleKey

MSG91_AUTH_KEY=$msg91Key
MSG91_TEMPLATE_ID=$msg91Tpl
MSG91_SENDER_ID=PCKYET

SENTRY_DSN=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
ZOMATO_AFFILIATE_CODE=PICKYEAT
SWIGGY_AFFILIATE_CODE=PICKYEAT
"@
    [IO.File]::WriteAllText($ENV_FILE, $env_body)
    Ok ".env written to $ENV_FILE"
} else {
    Ok ".env already exists at $ENV_FILE — leaving untouched"
}

# ── 4. Register with pm2 ────────────────────────────────────────────
Step "Register pm2 process '$PM2_NAME' on port $PORT"

# Stop+delete any previous instance (only pickyeat — not SROS)
& $PM2 delete $PM2_NAME 2>$null | Out-Null

# Start
Push-Location $APP_DIR
& $PM2 start "npm" --name $PM2_NAME -- start
Pop-Location

& $PM2 save
& $PM2 list

Ok "pm2 process '$PM2_NAME' running on port $PORT"

# ── 5. Self-test ────────────────────────────────────────────────────
Step 'Local health check'
Start-Sleep -Seconds 3
try {
    $r = Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:$PORT/health" -TimeoutSec 5
    Write-Host "  /health => $($r.Content)"
    Ok 'backend responding on localhost'
} catch {
    Write-Host "  /health did NOT respond. Check pm2 logs:" -ForegroundColor Yellow
    Write-Host "    $PM2 logs $PM2_NAME --lines 50"
    throw "Backend not healthy: $_"
}

Write-Host "`nDeploy done. Next: .\04-iis-site.ps1" -ForegroundColor Green
