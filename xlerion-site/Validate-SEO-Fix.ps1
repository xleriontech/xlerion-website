#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script de validación para verificar que todas las correcciones SEO están en lugar.

.DESCRIPTION
    Verifica:
    1. .htaccess tiene redirect rules para /views
    2. robots.txt tiene disallow para /views
    3. index.html tiene múltiples favicon referencias
    4. Configuración es consistente entre source y dist

.PARAMETER Environment
    'local' = Verifica archivos locales
    'production' = Verifica en servidor remoto (requiere -ServerUrl)

.PARAMETER ServerUrl
    URL del servidor de producción (ej: https://xlerion.com)
#>

param(
    [ValidateSet('local', 'production')]
    [string]$Environment = 'local',
    [string]$ServerUrl = 'https://xlerion.com'
)

$ErrorActionPreference = 'Stop'
$checksPasssed = 0
$checksFailed = 0

Write-Host "`n🔍 VALIDACIÓN SEO FIX - $Environment`n" -ForegroundColor Cyan
Write-Host "=" * 60

# ========== VALIDACIÓN LOCAL ==========
if ($Environment -eq 'local') {
    
    $projectPath = 'x:\Programacion\XlerionWeb\xlerion-site'
    $publicDir = "$projectPath\public"
    $indexHtml = "$projectPath\index.html"
    $distIndexHtml = "$projectPath\dist\index.html"
    $htaccessFile = "$publicDir\.htaccess"
    $robotsFile = "$publicDir\robots.txt"

    # Check 1: .htaccess tiene /views redirects
    Write-Host "`n1️⃣  Verificando .htaccess..." -ForegroundColor Yellow
    if (Test-Path $htaccessFile) {
        $htaccess = Get-Content $htaccessFile -Raw
        if ($htaccess -match 'RewriteRule \^views/\(\.\*\)\$ / \[R=301,L\]' -and 
            $htaccess -match 'Disallow-routes-comment') {
            Write-Host "   ✅ .htaccess tiene /views redirects (línea ~16)" -ForegroundColor Green
            $checksPassed++
        }
        else {
            Write-Host "   ❌ .htaccess NO tiene /views redirects" -ForegroundColor Red
            $checksFailed++
        }
    }
    else {
        Write-Host "   ⚠️  Archivo no encontrado: $htaccessFile" -ForegroundColor Red
        $checksFailed++
    }

    # Check 2: robots.txt tiene disallow /views
    Write-Host "`n2️⃣  Verificando robots.txt..." -ForegroundColor Yellow
    if (Test-Path $robotsFile) {
        $robots = Get-Content $robotsFile -Raw
        if ($robots -match 'Disallow: /views/$' -and $robots -match 'Disallow: /views$') {
            Write-Host "   ✅ robots.txt tiene Disallow: /views/ y /views" -ForegroundColor Green
            $checksPassed++
        }
        else {
            Write-Host "   ❌ robots.txt NO tiene disallow /views rules" -ForegroundColor Red
            $checksFailed++
        }
    }
    else {
        Write-Host "   ⚠️  Archivo no encontrado: $robotsFile" -ForegroundColor Red
        $checksFailed++
    }

    # Check 3: index.html source tiene 4 favicon links
    Write-Host "`n3️⃣  Verificando index.html (source)..." -ForegroundColor Yellow
    if (Test-Path $indexHtml) {
        $indexContent = Get-Content $indexHtml -Raw
        $faviconCount = [regex]::Matches($indexContent, 'rel="(icon|shortcut icon|apple-touch-icon|image_src)"').Count
        if ($faviconCount -ge 4) {
            Write-Host "   ✅ index.html tiene $faviconCount favicon referencias" -ForegroundColor Green
            $checksPassed++
        }
        else {
            Write-Host "   ❌ index.html solo tiene $faviconCount referencias (necesita 4)" -ForegroundColor Red
            $checksFailed++
        }
    }
    else {
        Write-Host "   ⚠️  Archivo no encontrado: $indexHtml" -ForegroundColor Red
        $checksFailed++
    }

    # Check 4: dist/index.html tiene 4 favicon links
    Write-Host "`n4️⃣  Verificando index.html (dist)..." -ForegroundColor Yellow
    if (Test-Path $distIndexHtml) {
        $distIndexContent = Get-Content $distIndexHtml -Raw
        $distFaviconCount = [regex]::Matches($distIndexContent, 'rel="(icon|shortcut icon|apple-touch-icon|image_src)"').Count
        if ($distFaviconCount -ge 4) {
            Write-Host "   ✅ dist/index.html tiene $distFaviconCount favicon referencias" -ForegroundColor Green
            $checksPassed++
        }
        else {
            Write-Host "   ❌ dist/index.html solo tiene $distFaviconCount referencias (necesita 4)" -ForegroundColor Red
            $checksFailed++
        }
    }
    else {
        Write-Host "   ⚠️  Archivo no encontrado: $distIndexHtml" -ForegroundColor Red
        Write-Host "      Ejecuta: npm run build" -ForegroundColor Yellow
        $checksFailed++
    }

    # Check 5: favicon.ico existe
    Write-Host "`n5️⃣  Verificando archivos de favicon..." -ForegroundColor Yellow
    $faviconFiles = @('favicon.ico', 'logo-512.png', 'logo-1200x1200.png')
    $allExist = $true
    foreach ($favicon in $faviconFiles) {
        $path = "$publicDir\$favicon"
        if (-not (Test-Path $path)) {
            Write-Host "   ❌ Falta: $favicon" -ForegroundColor Red
            $allExist = $false
            $checksFailed++
        }
    }
    if ($allExist) {
        Write-Host "   ✅ Todos los archivos de favicon existen" -ForegroundColor Green
        $checksPassed++
    }

    # Check 6: SITEMAP_CLEANUP.txt existe
    Write-Host "`n6️⃣  Verificando documentación..." -ForegroundColor Yellow
    $cleanupFile = "$publicDir\SITEMAP_CLEANUP.txt"
    if (Test-Path $cleanupFile) {
        Write-Host "   ✅ SITEMAP_CLEANUP.txt encontrado en public/" -ForegroundColor Green
        $checksPassed++
    }
    else {
        Write-Host "   ⚠️  SITEMAP_CLEANUP.txt NO encontrado" -ForegroundColor Yellow
    }

}
# ========== VALIDACIÓN PRODUCCIÓN ==========
else {
    
    Write-Host "`n📡 Conectando a: $ServerUrl" -ForegroundColor Cyan
    Write-Host "(Nota: Solo valida contenido HTTP, no rewrite rules en Apache)\n"

    # Check 1: Verificar redirect /views → /
    Write-Host "`n1️⃣  Probando redirect /views..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "$ServerUrl/views" -MaximumRedirection 1 -ErrorAction Stop
        Write-Host "   ⚠️  No se redirigió (status: $($response.StatusCode))" -ForegroundColor Yellow
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 'MovedPermanently' -or 
            $_.Exception.Response.StatusCode -eq 'Found') {
            Write-Host "   ✅ /views redirige (HTTP $($_.Exception.Response.StatusCode))" -ForegroundColor Green
            $checksPassed++
        }
        elseif ($_.Exception.Response.StatusCode -eq 'NotFound') {
            Write-Host "   ⚠️  /views retorna 404 (Apache quizás no tiene .htaccess)" -ForegroundColor Yellow
        }
        else {
            Write-Host "   ❌ Error: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
            $checksFailed++
        }
    }

    # Check 2: Verificar favicon.ico se sirve
    Write-Host "`n2️⃣  Verificando favicon.ico..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "$ServerUrl/favicon.ico" -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ favicon.ico se sirve (HTTP 200)" -ForegroundColor Green
            $checksPassed++
        }
    }
    catch {
        Write-Host "   ❌ favicon.ico NO encontrado: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        $checksFailed++
    }

    # Check 3: Verificar robots.txt
    Write-Host "`n3️⃣  Verificando robots.txt..." -ForegroundColor Yellow
    try {
        $robots = Invoke-WebRequest -Uri "$ServerUrl/robots.txt" -ErrorAction Stop
        if ($robots.Content -match 'Disallow: /views') {
            Write-Host "   ✅ robots.txt tiene 'Disallow: /views'" -ForegroundColor Green
            $checksPassed++
        }
        else {
            Write-Host "   ❌ robots.txt NO tiene disallow /views" -ForegroundColor Red
            $checksFailed++
        }
    }
    catch {
        Write-Host "   ❌ Error consultando robots.txt: $_" -ForegroundColor Red
        $checksFailed++
    }

    # Check 4: Verificar favicon refs en index.html
    Write-Host "`n4️⃣  Verificando favicon referencias en index.html..." -ForegroundColor Yellow
    try {
        $index = Invoke-WebRequest -Uri "$ServerUrl/" -ErrorAction Stop
        $faviconMatches = [regex]::Matches($index.Content, 'rel="(icon|shortcut icon|apple-touch-icon|image_src)"').Count
        if ($faviconMatches -ge 4) {
            Write-Host "   ✅ index.html tiene $faviconMatches favicon referencias" -ForegroundColor Green
            $checksPassed++
        }
        else {
            Write-Host "   ❌ index.html solo tiene $faviconMatches referencias (necesita 4)" -ForegroundColor Red
            $checksFailed++
        }
    }
    catch {
        Write-Host "   ❌ Error consultando index.html: $_" -ForegroundColor Red
        $checksFailed++
    }
}

# ========== RESUMEN FINAL ==========
Write-Host "`n" + "=" * 60
Write-Host "`n📊 RESUMEN" -ForegroundColor Cyan
Write-Host "   ✅ Checks pasados: $checksPassed" -ForegroundColor Green
Write-Host "   ❌ Checks fallidos: $checksFailed`n" -ForegroundColor Red

if ($checksFailed -eq 0) {
    Write-Host "🎉 ¡TODAS LAS VALIDACIONES PASARON!" -ForegroundColor Green
    Write-Host "`n✅ Sistema listo para:" -ForegroundColor Green
    if ($Environment -eq 'local') {
        Write-Host "   1. Deploy a producción"
        Write-Host "   2. Google Search Console cleanup"
    }
    else {
        Write-Host "   1. Monitoreo en Google Search Console"
        Write-Host "   2. Verificar desaparición de /views en SERP"
    }
    exit 0
}
else {
    Write-Host "⚠️  Hay problemas que necesitan atención" -ForegroundColor Yellow
    Write-Host "`n📝 Acciones recomendadas:" -ForegroundColor Yellow
    Write-Host "   1. Revisar archivos en: $projectPath"
    Write-Host "   2. Ejecutar: npm run build (si es local)"
    Write-Host "   3. Copiar archivos a servidor (si es producción)"
    exit 1
}
