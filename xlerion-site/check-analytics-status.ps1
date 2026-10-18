#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Agregar useAnalytics a todas las páginas React que NO lo tengan
#>

$pagesDir = 'x:\Programacion\XlerionWeb\xlerion-site\src\pages'

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

Write-Host "`n📍 VERIFICANDO PÁGINAS REACT..." -ForegroundColor Magenta

$updated = 0
$skipped = 0
$missing = 0

foreach ($page in $pagesMeta) {
    $filePath = Join-Path $pagesDir $page.name
    
    if (!(Test-Path $filePath)) {
        Write-Host "⚠ NO EXISTE: $($page.name)" -ForegroundColor Yellow
        $missing++
        continue
    }

    $content = Get-Content $filePath -Raw

    # Verificar si ya tiene useAnalytics
    if ($content -match "useAnalytics") {
        Write-Host "✓ YA TIENE: $($page.name)" -ForegroundColor Green
        $skipped++
        continue
    }

    # Si no tiene, indicar cuál necesita analytics
    Write-Host "⚠ FALTA: $($page.name)" -ForegroundColor Yellow
    $updated++
}

Write-Host "`n════════════════════════════════════════════════════════════"
Write-Host "`n📊 RESUMEN:" -ForegroundColor Magenta
Write-Host "   • Con analytics: $skipped páginas" -ForegroundColor Green
Write-Host "   • Sin analytics: $updated páginas" -ForegroundColor Yellow
Write-Host "   • No existen: $missing páginas" -ForegroundColor Gray
Write-Host "`n💡 Las páginas sin analytics serán actualizadas manualmente" -ForegroundColor Yellow
