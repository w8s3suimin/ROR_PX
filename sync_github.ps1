param(
    [string]$CommitMessage = "Auto sync from local $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

Write-Host "Adding changes..." -ForegroundColor Cyan
git add .

Write-Host "Committing changes..." -ForegroundColor Cyan
git commit -m $CommitMessage

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host "Sync completed!" -ForegroundColor Green
