# Script para iniciar el servidor PHP para Total Darkness
# Ejecuta este script en PowerShell para iniciar el backend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Total Darkness - PHP Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si PHP está instalado
$phpVersion = php -v 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERROR: PHP no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Para instalar PHP en Windows:" -ForegroundColor Yellow
    Write-Host "1. Descargar desde: https://windows.php.net/download/" -ForegroundColor White
    Write-Host "2. O instalar con Chocolatey: choco install php" -ForegroundColor White
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "✅ PHP detectado:" -ForegroundColor Green
Write-Host $phpVersion.Split("`n")[0] -ForegroundColor White
Write-Host ""

# Ruta del directorio total-darkness
$projectPath = "x:\Programacion\XlerionWeb\xlerion-site\public\total-darkness"

# Verificar que el directorio existe
if (-not (Test-Path $projectPath)) {
    Write-Host "❌ ERROR: No se encontró el directorio del proyecto" -ForegroundColor Red
    Write-Host "Ruta buscada: $projectPath" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "📁 Directorio del proyecto: $projectPath" -ForegroundColor White
Write-Host ""

# Crear directorio data si no existe
$dataPath = Join-Path $projectPath "data"
if (-not (Test-Path $dataPath)) {
    New-Item -ItemType Directory -Path $dataPath -Force | Out-Null
    Write-Host "✅ Directorio 'data' creado" -ForegroundColor Green
}

# Verificar permisos de escritura
try {
    $testFile = Join-Path $dataPath "test.txt"
    "test" | Out-File $testFile -ErrorAction Stop
    Remove-Item $testFile -ErrorAction SilentlyContinue
    Write-Host "✅ Permisos de escritura verificados en 'data'" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  ADVERTENCIA: Puede haber problemas de permisos en 'data'" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuración del servidor" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Puerto: 8080" -ForegroundColor White
Write-Host "URL Base: http://localhost:8080/total-darkness/" -ForegroundColor White
Write-Host "URL API: http://localhost:8080/total-darkness/api/auth.php" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Información adicional
Write-Host "📝 IMPORTANTE:" -ForegroundColor Yellow
Write-Host "   - El servidor Vite (puerto 5173) debe seguir corriendo" -ForegroundColor White
Write-Host "   - Este servidor PHP (puerto 8080) maneja el backend" -ForegroundColor White
Write-Host "   - Accede al panel en: http://localhost:5173/total-darkness/" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Para testing:" -ForegroundColor Yellow
Write-Host "   http://localhost:5173/total-darkness/test-backend-auth.html" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C para detener el servidor" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SERVIDOR INICIADO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Iniciar servidor PHP
Set-Location $projectPath
php -S localhost:8080 -t .
