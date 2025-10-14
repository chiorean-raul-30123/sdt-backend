<# dev-down.ps1 — oprește serviciile docker #>
$ErrorActionPreference = "Stop"
Write-Host "Stopping docker compose services..." -ForegroundColor Cyan
docker compose down
Write-Host "Done." -ForegroundColor Green
