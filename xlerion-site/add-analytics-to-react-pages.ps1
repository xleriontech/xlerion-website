#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Agregar useAnalytics a todas las páginas React que NO lo tengan
.DESCRIPTION
    Este script:
    1. Busca todas las páginas en src/pages/*.jsx
    2. Verifica si tienen useAnalytics importado
    3. Si no lo tienen, agrega el import y la llamada
    4. Respeta títulos personalizados de cada página
.EXAMPLE
    .\add-analytics-to-react-pages.ps1
#>

$pagesDir = 'x:\Programacion\XlerionWeb\xlerion-site\src\pages'
$hookPath = '../hooks/useAnalytics'

# Mapa de páginas con sus títulos en analytics
$pagesMeta = @(
    @{ name = 'AIIntegrationPage.jsx'; title = 'Integración IA'; type = 'service' },
    @{ name = 'AlojamientoPage.jsx'; title = 'Alojamiento'; type = 'service' },
    @{ name = 'AnalyticsAdminPage.jsx'; title = 'Analytics Admin'; type = 'admin' },
    @{ name = 'AnalyticsIntegrationPage.jsx'; title = 'Integración Analytics'; type = 'service' },
    @{ name = 'APIIntegrationPage.jsx'; title = 'Integración API'; type = 'service' },
    @{ name = 'BrandingPage.jsx'; title = 'Branding'; type = 'service' },
    @{ name = 'BlockchainIntegrationPage.jsx'; title = 'Integración Blockchain'; type = 'service' },
    @{ name = 'CapacitacionPage.jsx'; title = 'Capacitación'; type = 'service' },
    @{ name = 'ConsultoriaPage.jsx'; title = 'Consultoría'; type = 'service' },
    @{ name = 'CotizacionServiciosPage.jsx'; title = 'Cotización'; type = 'service' },
    @{ name = 'DiagLogPerfPage.jsx'; title = 'Diagnóstico Performance'; type = 'doc' },
    @{ name = 'DiagnosticoPage.jsx'; title = 'Diagnóstico'; type = 'doc' },
    @{ name = 'DiagramasFlujosPage.jsx'; title = 'Diagramas'; type = 'doc' },
    @{ name = 'DocsStructPage.jsx'; title = 'Documentación'; type = 'doc' },
    @{ name = 'ElRoperoPage.jsx'; title = 'El Ropero'; type = 'project' },
    @{ name = 'FounderPage.jsx'; title = 'Fundador'; type = 'page' },
    @{ name = 'GuiasInstalacionPage.jsx'; title = 'Guías'; type = 'doc' },
    @{ name = 'IngenieriaPage.jsx'; title = 'Ingeniería'; type = 'service' },
    @{ name = 'Integracion3DPage.jsx'; title = 'Integración 3D'; type = 'service' },
    @{ name = 'IoTIntegrationPage.jsx'; title = 'Integración IoT'; type = 'service' },
    @{ name = 'LicensesPage.jsx'; title = 'Licencias'; type = 'page' },
    @{ name = 'LoggingPage.jsx'; title = 'Logging'; type = 'doc' },
    @{ name = 'ManualesPage.jsx'; title = 'Manuales'; type = 'doc' },
    @{ name = 'MisionPage.jsx'; title = 'Misión'; type = 'page' },
    @{ name = 'PerformancePage.jsx'; title = 'Performance'; type = 'doc' },
    @{ name = 'PortfolioReelsPage.jsx'; title = 'Portfolio'; type = 'page' },
    @{ name = 'PrivacyPage.jsx'; title = 'Privacidad'; type = 'page' },
    @{ name = 'RadioNocaimaPageFixed.jsx'; title = 'Radio Nocaima'; type = 'project' },
    @{ name = 'Renders3DGalleryPage.jsx'; title = 'Renders 3D'; type = 'page' },
    @{ name = 'SimulationIntegrationPage.jsx'; title = 'Integración Simulación'; type = 'service' },
    @{ name = 'SmartIntegrationPage.jsx'; title = 'Integración Smart'; type = 'service' },
    @{ name = 'SmartTrafficDemoPage.jsx'; title = 'Smart Traffic'; type = 'demo' },
    @{ name = 'SolucionesMedidaPage.jsx'; title = 'Soluciones'; type = 'service' },
    @{ name = 'SoportePage.jsx'; title = 'Soporte'; type = 'page' },
    @{ name = 'TaxTrackerPage.jsx'; title = 'Tax Tracker'; type = 'service' },
    @{ name = 'TecnologiasComunidadPage.jsx'; title = 'Tecnologías'; type = 'page' },
    @{ name = 'TermsPage.jsx'; title = 'Términos'; type = 'page' },
    @{ name = 'TestRadio.jsx'; title = 'Test Radio'; type = 'test' },
    @{ name = 'ThreeJSIntersectionPage.jsx'; title = 'Three.js'; type = 'demo' },
    @{ name = 'TotalDarknessProjectPage.jsx'; title = 'Total Darkness'; type = 'project' },
    @{ name = 'TransitoMovilidadPage.jsx'; title = 'Tránsito'; type = 'service' },
    @{ name = 'TurismoPage.jsx'; title = 'Turismo'; type = 'service' },
    @{ name = 'ValidationPage.jsx'; title = 'Validación'; type = 'doc' },
    @{ name = 'VisionPage.jsx'; title = 'Visión'; type = 'page' },
    @{ name = 'XlerionGreenWavePage.jsx'; title = 'GreenWave'; type = 'project' },
    @{ name = 'XlerionToolkitProjectPage.jsx'; title = 'Toolkit'; type = 'project' },
    @{ name = 'ToolkitsPage.jsx'; title = 'Toolkits'; type = 'page' }
)

$updated = 0
$skipped = 0

Write-Host "`n📍 ANALIZANDO PÁGINAS REACT..." -ForegroundColor Magenta
Write-Host "════════════════════════════════════════════════════════════`n"

foreach ($page in $pagesMeta) {
    $filePath = Join-Path $pagesDir $page.name
    
    if (!(Test-Path $filePath)) {
        Write-Host "⚠ NO EXISTE: $($page.name)" -ForegroundColor Yellow
        continue
    }

    $content = Get-Content $filePath -Raw

    # Verificar si ya tiene useAnalytics
    if ($content -match "useAnalytics") {
        Write-Host "✓ YA TIENE: $($page.name)" -ForegroundColor Green
        $skipped++
        continue
    }

    # Buscar si tiene import de useLanguage
    if ($content -match "import.*useLanguage") {
        # Agregar import después de useLanguage
        $content = $content -replace "(import.*useLanguage[^\n]*\n)", "`$1import { useAnalytics } from '../hooks/useAnalytics';`n"
    }
    else {
        # Agregar al inicio del archivo
        $content = $content -replace "(import\s+{[^}]+}\s+from\s+['\"]react['\"];?)", "`$1`nimport { useAnalytics } from '../hooks/useAnalytics';"
    }

    # Buscar la función principal y agregar useAnalytics dentro
    $functionPattern = "(export\s+default\s+function\s+$($page.name -replace '\.jsx$', '')\s*\(\s*\)\s*\{|\sconst\s+$($page.name -replace '\.jsx$', '')\s*=\s*\(\s*\)\s*=>\s*\{)"
    
    if ($content -match $functionPattern) {
        # Agregar después de la apertura de la función
        $pageType = $page.type
        $pageTitle = $page.title
        $analyticsLine = "    useAnalytics('$pageTitle', '$pageType');"
        
        $content = $content -replace $functionPattern, "`$1`n$analyticsLine"
        
        Set-Content -Path $filePath -Value $content
        Write-Host "✓ ACTUALIZADO: $($page.name)" -ForegroundColor Cyan
        $updated++
    } else {
        Write-Host "⚠ NO SE PUDO ACTUALIZAR: $($page.name)" -ForegroundColor Yellow
    }
}

Write-Host "`n════════════════════════════════════════════════════════════"
Write-Host "`n✅ RESUMEN:" -ForegroundColor Green
Write-Host "   • Actualizadas: $updated páginas" -ForegroundColor Green
Write-Host "   • Ya tenían: $skipped páginas" -ForegroundColor Green
Write-Host "`n💡 PRÓXIMO PASO: npm run build && Deploy" -ForegroundColor Yellow
