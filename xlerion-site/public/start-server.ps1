#!/usr/bin/env pwsh
# Script para iniciar el servidor PHP con router

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║ Total Darkness - PHP Server Launcher   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Variables
$basePath = "x:\Programacion\XlerionWeb\xlerion-site\public"
$routerPath = "$basePath\router.php"

# Verificaciones
Write-Host "Verificando requisitos..." -ForegroundColor Yellow

if (-not (Test-Path $basePath)) {
    Write-Host "❌ Error: Directorio no encontrado: $basePath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $routerPath)) {
    Write-Host "❌ Error: Router no encontrado: $routerPath" -ForegroundColor Red
    exit 1
}

# Detener procesos PHP anteriores
Write-Host "Deteniendo procesos PHP anteriores..." -ForegroundColor Yellow
Get-Process -Name "php" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

if ($?) {
    Write-Host "✅ Procesos detenidos" -ForegroundColor Green
}
else {
    Write-Host "ℹ️  No había procesos PHP corriendo" -ForegroundColor Gray
}

Start-Sleep -Seconds 1

# Iniciar servidor
Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Iniciando PHP Server..." -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Puerto: 8080" -ForegroundColor Green
Write-Host "📍 URL Base: http://localhost:8080" -ForegroundColor Green
Write-Host "📍 Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "📍 API: http://localhost:8080/total-darkness/api/auth.php" -ForegroundColor Green
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Ejecutar servidor
Set-Location $basePath
& php -S localhost:8080 $routerPath
