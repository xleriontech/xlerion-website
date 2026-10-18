#!/usr/bin/env pwsh
# Script para reiniciar el servidor PHP con diagnóstico

$basePath = "x:\Programacion\XlerionWeb\xlerion-site\public\total-darkness"
$phpIni = "$basePath\php.ini"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Reiniciando PHP Development Server" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que php está disponible
$phpVersion = php --version | Select-Object -First 1
Write-Host "PHP Version: $phpVersion" -ForegroundColor Green
Write-Host ""

# Detener servidor anterior si está corriendo
Write-Host "Buscando procesos PHP anteriores..." -ForegroundColor Yellow
$processes = Get-Process -Name "php" -ErrorAction SilentlyContinue
if ($processes) {
    Write-Host "Deteniendo procesos PHP anteriores..." -ForegroundColor Yellow
    $processes | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "Iniciando servidor PHP..." -ForegroundColor Yellow
Write-Host "Puerto: 8080" -ForegroundColor Green
Write-Host "URL: http://localhost:8080/total-darkness/api/auth.php" -ForegroundColor Green
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Iniciar el servidor
Set-Location $basePath
php -S localhost:8080 -t "$basePath" -c "$phpIni"
