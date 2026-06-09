Set-Location "C:\AI-Projects\subzerometrix"
Write-Host "Working directory: $(Get-Location)" -ForegroundColor Cyan

Write-Host "Stopping existing node processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "Node processes stopped." -ForegroundColor Green

if (-not (Test-Path "node_modules")) {
    Write-Host "node_modules not found. Running npm install..." -ForegroundColor Yellow
    npm.cmd install
} else {
    Write-Host "node_modules found. Skipping install." -ForegroundColor Green
}

Write-Host "Starting dev server at http://localhost:3000 ..." -ForegroundColor Cyan
npm.cmd run dev
