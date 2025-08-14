# Portfolio Deployment Script for GitHub Pages
# This script helps you deploy your built portfolio to GitHub Pages

Write-Host "🚀 Portfolio Deployment Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if dist folder exists
if (-not (Test-Path "dist")) {
    Write-Host "❌ Error: dist folder not found!" -ForegroundColor Red
    Write-Host "Please run 'npm run build:gh-pages' first" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Build folder found" -ForegroundColor Green

# Show what will be deployed
Write-Host "`n📁 Files to be deployed:" -ForegroundColor Cyan
Get-ChildItem -Path "dist" -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path + "\dist\", "")
    Write-Host "   $relativePath" -ForegroundColor White
}

Write-Host "`n📋 Deployment Instructions:" -ForegroundColor Yellow
Write-Host "1. Go to: https://github.com/harneet2512/harneet2512.github.io" -ForegroundColor White
Write-Host "2. Delete all existing files (except .git folder)" -ForegroundColor White
Write-Host "3. Upload all contents from the 'dist' folder" -ForegroundColor White
Write-Host "4. Commit and push the changes" -ForegroundColor White
Write-Host "5. Wait a few minutes for GitHub Pages to update" -ForegroundColor White

Write-Host "`n🌐 Your portfolio will be available at:" -ForegroundColor Green
Write-Host "   https://harneet2512.github.io" -ForegroundColor Cyan

Write-Host "`n💡 Tip: For automatic deployment, push this entire project to your repository" -ForegroundColor Yellow
Write-Host "   and enable GitHub Actions in the repository settings." -ForegroundColor Yellow

Write-Host "`nPress any key to open the dist folder..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process "dist"
