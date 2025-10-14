<#
 dev-up.ps1 — pornește DB (docker), backend (Spring), frontend (React)
 Rulează din rădăcina repo-ului (folderul SCD).
#>

$ErrorActionPreference = "Stop"

function Assert-Tool($name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    throw "$name is not installed or not in PATH."
  }
}

Write-Host "Checking tools..." -ForegroundColor Cyan
Assert-Tool docker
Assert-Tool mvn
Assert-Tool powershell

# 1) Start Docker services (Postgres)
Write-Host "`n[1/3] Starting Postgres via docker compose..." -ForegroundColor Cyan
docker compose up -d

# Wait for port 5433 to listen (max ~20s)
$deadline = (Get-Date).AddSeconds(20)
$ready = $false
while ((Get-Date) -lt $deadline) {
  try {
    $conn = New-Object System.Net.Sockets.TcpClient
    $conn.Connect("127.0.0.1", 5433)
    if ($conn.Connected) { $ready = $true; $conn.Close(); break }
  } catch {}
  Start-Sleep -Milliseconds 500
}
if (-not $ready) {
  Write-Warning "Postgres might not be ready yet, continuing anyway..."
} else {
  Write-Host "Postgres is listening on 5433." -ForegroundColor Green
}

# 2) Start Spring Boot (backend) în nouă fereastră
Write-Host "`n[2/3] Starting Spring Boot (backend)..." -ForegroundColor Cyan
$backendPath = Join-Path (Get-Location) "sdt-backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$backendPath`"; mvn spring-boot:run"

# 3) Start React (frontend) în nouă fereastră — dacă există sdt-web
$webPath = Join-Path (Get-Location) "sdt-web"
if (Test-Path $webPath) {
  Write-Host "`n[3/3] Starting React dev server (UI)..." -ForegroundColor Cyan
  Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$webPath`"; if (Test-Path package-lock.json) { npm ci } else { npm install }; npm run dev"
} else {
  Write-Host "`n[3/3] UI folder 'sdt-web' not found. Skipping." -ForegroundColor Yellow
}

Write-Host "`nAll set. Backend: http://localhost:8080  |  UI: http://localhost:5173" -ForegroundColor Green
