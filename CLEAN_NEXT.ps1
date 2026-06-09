Set-Location "C:\AI-Projects\subzerometrix"
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host ".next deleted. Run START_DEV.ps1 or BUILD_CHECK.ps1 to rebuild." -ForegroundColor Green
} else {
    Write-Host ".next folder not found — nothing to clean." -ForegroundColor Yellow
}
