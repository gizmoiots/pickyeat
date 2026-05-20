# pickyeat -- Install missing prerequisites
# Only installs what's MISSING. Skips anything already present (e.g. Node, pm2, IIS -- all SROS uses).
#
# Usage: PowerShell as Administrator
#   cd C:\pickyeat\vps
#   .\02-prereqs.ps1

$ErrorActionPreference = 'Stop'

function Step($msg) { Write-Host "`n>> $msg" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "  [OK]   $msg" -ForegroundColor Green }
function Skip($msg) { Write-Host "  [SKIP] $msg" -ForegroundColor Yellow }

# Require admin
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]'Administrator')) {
    throw 'Run PowerShell as Administrator. Right-click Start -> Terminal (Admin).'
}

# --- Git ---
Step 'Git'
if (Get-Command git -ErrorAction SilentlyContinue) {
    Skip "git already installed -- $(& git --version)"
} else {
    Write-Host '  Downloading Git for Windows...'
    $url = 'https://github.com/git-for-windows/git/releases/download/v2.45.2.windows.1/Git-2.45.2-64-bit.exe'
    $tmp = "$env:TEMP\Git-installer.exe"
    Invoke-WebRequest -UseBasicParsing $url -OutFile $tmp
    Start-Process $tmp -ArgumentList '/VERYSILENT /NORESTART /COMPONENTS="icons,ext\reg\shellhere,assoc,assoc_sh"' -Wait
    $env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')
    Ok "git installed -- $(& git --version)"
}

# --- Node.js (only if missing) ---
Step 'Node.js 20 LTS'
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
    $ver = (& node -v).TrimStart('v').Split('.')[0]
    if ([int]$ver -ge 20) {
        Skip "node $(& node -v) already installed (>= 20)"
    } else {
        Write-Host "  Found node $(& node -v) but pickyeat needs >= 20. Install Node 20 LTS manually from https://nodejs.org/ -- SROS may rely on this version, so don't auto-upgrade." -ForegroundColor Yellow
        throw 'Manual Node upgrade required -- verify SROS compatibility first.'
    }
} else {
    Write-Host '  Node not found -- installing 20 LTS via winget...'
    winget install OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements
    Ok "node installed -- $(& node -v)"
}

# --- pm2 (only if missing) ---
Step 'pm2'
$pm2 = "$env:APPDATA\npm\pm2.cmd"
if (Test-Path $pm2) {
    Skip "pm2 already installed at $pm2"
} else {
    Write-Host '  Installing pm2 globally...'
    & npm install -g pm2 pm2-windows-startup
    Ok 'pm2 installed'
}

# --- Win-ACME ---
Step 'Win-ACME (Let''s Encrypt client for Windows)'
$wacsLocations = @(
    "$env:ProgramFiles\win-acme\wacs.exe",
    'C:\Tools\win-acme\wacs.exe'
) | Where-Object { Test-Path $_ }

if ($wacsLocations) {
    Skip "win-acme already at $($wacsLocations[0])"
} else {
    Write-Host '  Downloading Win-ACME...'
    $wacUrl = 'https://github.com/win-acme/win-acme/releases/download/v2.2.9.1701/win-acme.v2.2.9.1701.x64.pluggable.zip'
    $zip = "$env:TEMP\win-acme.zip"
    $dest = 'C:\Tools\win-acme'
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
    Invoke-WebRequest -UseBasicParsing $wacUrl -OutFile $zip
    Expand-Archive -Path $zip -DestinationPath $dest -Force
    Remove-Item $zip
    Ok "win-acme installed at $dest"
}

# --- IIS sanity check (do NOT install or change features) ---
Step 'IIS sanity check (read-only)'
if (Get-Module -ListAvailable WebAdministration) {
    Skip 'IIS WebAdministration module present -- IIS already installed (used by SROS).'
} else {
    Write-Host "  IIS not installed. STOPPING -- this script does not install IIS automatically because it can disrupt other services. If you need IIS, run as admin:" -ForegroundColor Yellow
    Write-Host "    Install-WindowsFeature -Name Web-Server,Web-Mgmt-Console,Web-Asp-Net45 -IncludeManagementTools" -ForegroundColor Yellow
    throw 'IIS missing -- manual install required.'
}

# --- URL Rewrite + ARR sanity check ---
Step 'URL Rewrite + ARR sanity check'
$ur = Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\IIS Extensions\URL Rewrite' -ErrorAction SilentlyContinue
$arr = Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\IIS Extensions\Application Request Routing' -ErrorAction SilentlyContinue
if ($ur -and $arr) {
    Skip "URL Rewrite $($ur.Version) + ARR $($arr.Version) already present (used by SROS)."
} else {
    Write-Host '  Missing URL Rewrite or ARR. SROS likely needs these too -- installing them is safe.' -ForegroundColor Yellow
    Write-Host '  Download manually from:'
    Write-Host '    https://www.iis.net/downloads/microsoft/url-rewrite'
    Write-Host '    https://www.iis.net/downloads/microsoft/application-request-routing'
    throw 'Install URL Rewrite + ARR manually, then re-run this script.'
}

Write-Host "`nPrereqs done. Next: .\03-deploy.ps1" -ForegroundColor Green
