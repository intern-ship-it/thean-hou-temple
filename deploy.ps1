# Deploy script for Thean Hou Temple - Production Build

Write-Host "🏯 Thean Hou Temple - Production Build Script" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "frontend") -or -not (Test-Path "backend")) {
    Write-Host "❌ Error: Please run this script from the project root" -ForegroundColor Red
    Write-Host "   Expected folders: frontend/ and backend/" -ForegroundColor Red
    exit 1
}

# Navigate to frontend
Write-Host "📂 Navigating to frontend..." -ForegroundColor Yellow
Set-Location frontend

# Install dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
npm install

# Build React app
Write-Host "🔨 Building React application..." -ForegroundColor Yellow
npm run build

# Clean old build from Laravel public
Write-Host "🧹 Cleaning old build files from Laravel public..." -ForegroundColor Yellow
Set-Location ../backend/public
if (Test-Path "assets") { Remove-Item -Recurse -Force "assets" }
if (Test-Path "index.html") { Remove-Item -Force "index.html" }
if (Test-Path "vite.svg") { Remove-Item -Force "vite.svg" }

# Copy new build
Write-Host "📋 Copying new build to Laravel public..." -ForegroundColor Yellow
Set-Location ../../frontend
Copy-Item -Path "dist/*" -Destination "../backend/public/" -Recurse -Force

# Back to root
Set-Location ..

Write-Host ""
Write-Host "✅ Build completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📤 Next Steps for cPanel Deployment:" -ForegroundColor Cyan
Write-Host "   1. Navigate to the 'backend' folder"
Write-Host "   2. Compress it as a ZIP file"
Write-Host "   3. Upload to cPanel File Manager"
Write-Host "   4. Extract in public_html (or your domain folder)"
Write-Host "   5. Point your domain to the 'public' subfolder"
Write-Host "   6. Update .env with production database credentials"
Write-Host "   7. Run: php artisan config:cache"
Write-Host "   8. Run: php artisan migrate --force"
Write-Host ""
Write-Host "📁 Backend folder location: $(Get-Location)\backend" -ForegroundColor Yellow
Write-Host ""