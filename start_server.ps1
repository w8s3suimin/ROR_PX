# Change to the script's directory to ensure correct path execution
Set-Location -Path $PSScriptRoot

Write-Host "Starting Development Server..." -ForegroundColor Green
Write-Host "Once started, you can Ctrl+Click on the http://localhost:5173/ link to open it in your browser." -ForegroundColor Cyan

# Run npm run dev
npm run dev

# Prevent the window from closing immediately if the server stops
Pause
