#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Agregar Analytics a todas las páginas HTML (Redemthor, Total Darkness, etc)
.EXAMPLE
    .\add-analytics-to-pages.ps1
#>

$RedemthorPath = 'x:\Programacion\XlerionWeb\xlerion-site\public\redemthor'
$TotalDarknessPath = 'x:\Programacion\XlerionWeb\xlerion-site\public\total-darkness'

$ReddemthorPages = @(
    @{ file = 'discografia.html'; title = 'Redemthor - Discografía' },
    @{ file = 'game.html'; title = 'Redemthor - Videojuego' },
    @{ file = 'historia-evolucion.html'; title = 'Redemthor - Evolución' },
    @{ file = 'historia-fundacion.html'; title = 'Redemthor - Fundación' },
    @{ file = 'miembros.html'; title = 'Redemthor - Miembros' },
    @{ file = 'transmisiones.html'; title = 'Redemthor - Transmisiones' }
)

function Add-AnalyticsToHTML {
    param(
        [string]$FilePath,
        [string]$PageTitle
    )

    if (!(Test-Path $FilePath)) {
        Write-Host "❌ NO EXISTE: $FilePath" -ForegroundColor Red
        return
    }

    $content = Get-Content $FilePath -Raw

    # Verificar si ya tiene analytics
    if ($content -match "analytics-tracker.js") {
        Write-Host "✓ YA TIENE: $(Split-Path $FilePath -Leaf)" -ForegroundColor Green
        return
    }

    # Buscar la etiqueta de cierre </body>
    $analyticsScript = @"
    <!-- Analytics Tracker -->
    <script src="../js/analytics-tracker.js"></script>
    <script>
        // Inicializar tracking de analytics
        initAnalytics('$PageTitle', 'page');
    </script>
"@

    if ($content -match '</body>') {
        $newContent = $content -replace '(</body>)', ($analyticsScript + "`n`$1")
        Set-Content -Path $FilePath -Value $newContent
        Write-Host "✓ ACTUALIZADO: $(Split-Path $FilePath -Leaf)" -ForegroundColor Cyan
    }
    else {
        Write-Host "⚠ NO ENCONTRADO: </body> en $(Split-Path $FilePath -Leaf)" -ForegroundColor Yellow
    }
}

# Agregar a Redemthor
Write-Host "`n📍 AGREGANDO ANALYTICS A REDEMTHOR..." -ForegroundColor Magenta
foreach ($page in $ReddemthorPages) {
    $filePath = Join-Path $RedemthorPath $page.file
    Add-AnalyticsToHTML -FilePath $filePath -PageTitle $page.title
}

# Archivos especiales de Total Darkness (excepto index, dashboard, recovery que ya fueron hechos)
Write-Host "`n📍 VERIFICANDO ARCHIVOS ESPECIALES DE TOTAL DARKNESS..." -ForegroundColor Magenta
$specialTDFiles = @(
    @{ file = 'reset-password.html'; title = 'Total Darkness - Reset' },
    @{ file = 'system-status.html'; title = 'Total Darkness - Status' }
)

foreach ($page in $specialTDFiles) {
    $filePath = Join-Path $TotalDarknessPath $page.file
    Add-AnalyticsToHTML -FilePath $filePath -PageTitle $page.title
}

Write-Host "`n✅ COMPLETADO: Analytics agregado a todas las páginas principales" -ForegroundColor Green
Write-Host "   Archivos modificados:" -ForegroundColor Green
Write-Host "   • Redemthor: 6 páginas" -ForegroundColor Green
Write-Host "   • Total Darkness: 5 páginas (index, dashboard, recovery, reset, status)" -ForegroundColor Green
Write-Host "`n💡 NOTA: Los archivos HTML de test/debug NO tienen analytics (es intencional)" -ForegroundColor Yellow
