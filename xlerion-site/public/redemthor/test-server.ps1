# Simple test server for Redemthor
# Run from: C:\path\to\xlerion-site\public
# Usage: .\redemthor\test-server.ps1

Write-Host "Starting PHP test server for Redemthor..." -ForegroundColor Green
Write-Host "Server will run at: http://localhost:8080/redemthor/" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location -Path "..\"

# Start PHP server on port 8080, using router.php for routing
php -S localhost:8080 router.php
