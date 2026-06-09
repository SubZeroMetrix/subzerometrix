Set-Location "C:\AI-Projects\subzerometrix"
Write-Host "Running build check from: $(Get-Location)" -ForegroundColor Cyan
npm.cmd run build
