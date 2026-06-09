Set-Location "C:\AI-Projects\subzerometrix"
Write-Host "Git status for: $(Get-Location)" -ForegroundColor Cyan
git status
Write-Host ""
Write-Host "Recent commits:" -ForegroundColor Cyan
git log --oneline -5
