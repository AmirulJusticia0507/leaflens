# build-twa.ps1 - Build TWA APK dari LeafLens PWA
# Requirements: cloudflared terinstall di C:\laragon\bin\cloudflared\
# Usage: cd apps/web/twa; .\build-twa.ps1

param(
    [string]$TunnelUrl = ""
)

$ErrorActionPreference = "Stop"
$env:JAVA_HOME = "C:\Users\amiru\.bubblewrap\jdk\jdk-17.0.11+9"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"

Write-Host "=== LeafLens TWA Builder ===" -ForegroundColor Green

# 1. Start dev server if not running
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if (-not $port3000) {
    Write-Host "[1/4] Starting Next.js dev server..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"C:\laragon\www\leaflens`"; pnpm dev" -WindowStyle Minimized
    Start-Sleep -Seconds 8
} else {
    Write-Host "[1/4] Dev server already running" -ForegroundColor Yellow
}

# 2. Get tunnel URL
if (-not $TunnelUrl) {
    Write-Host "[2/4] Starting Cloudflare Tunnel..." -ForegroundColor Yellow
    $cf = "C:\laragon\bin\cloudflared\cloudflared.exe"
    $logFile = "$env:TEMP\cf-tunnel.log"
    Start-Process $cf -ArgumentList "tunnel --url http://localhost:3000" -RedirectStandardError $logFile -NoNewWindow
    
    $attempts = 0
    while ($attempts -lt 30) {
        Start-Sleep -Seconds 2
        $lines = Get-Content $logFile -ErrorAction SilentlyContinue
        $found = $lines | Select-String "https://[a-z0-9-]+\.trycloudflare\.com"
        if ($found) {
            $TunnelUrl = $found.Matches[0].Value
            break
        }
        $attempts++
    }
    if (-not $TunnelUrl) { throw "Tunnel timeout. Pastikan cloudflared terinstall." }
}
Write-Host "Tunnel: $TunnelUrl" -ForegroundColor Cyan

# 3. Bubblewrap init (interactive, first-time only)
$manifest = "$TunnelUrl/manifest.webmanifest"
Write-Host "[3/4] Fetching manifest: $manifest" -ForegroundColor Yellow

if (-not (Test-Path "$PSScriptRoot\twa-manifest.json")) {
    Write-Host "Running bubblewrap init (answer the prompts)..." -ForegroundColor Yellow
    Push-Location $PSScriptRoot
    & bubblewrap init --manifest $manifest --directory .
    Pop-Location
} else {
    Write-Host "twa-manifest.json exists - running update..." -ForegroundColor Yellow
    Push-Location $PSScriptRoot
    & bubblewrap update --manifest .
    Pop-Location
}

# 4. Build APK
Write-Host "[4/4] Building TWA APK..." -ForegroundColor Yellow
Push-Location $PSScriptRoot
$env:BUBBLEWRAP_KEYSTORE_PASSWORD = "leaflens"
$env:BUBBLEWRAP_KEY_PASSWORD = "leaflens"
& bubblewrap build --skipPwaValidation --skipSigning
Pop-Location

Write-Host "=== DONE ===" -ForegroundColor Green
Write-Host "APK: $PSScriptRoot\app-release-signed.apk"