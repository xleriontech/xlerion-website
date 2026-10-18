$pages = @(
    @{File = "XlerionToolkitProjectPage.jsx"; Name = "Xlerion Toolkit"; Type = "project" },
    @{File = "TransitoMovilidadPage.jsx"; Name = "Tránsito y Movilidad"; Type = "project" },
    @{File = "TecnologiasComunidadPage.jsx"; Name = "Tecnologías para la Comunidad"; Type = "project" },
    @{File = "SmartIntegrationPage.jsx"; Name = "Smart Integration"; Type = "project" },
    @{File = "AIIntegrationPage.jsx"; Name = "AI Integration"; Type = "service" },
    @{File = "BlockchainIntegrationPage.jsx"; Name = "Blockchain Integration"; Type = "service" },
    @{File = "IoTIntegrationPage.jsx"; Name = "IoT Integration"; Type = "service" },
    @{File = "AnalyticsIntegrationPage.jsx"; Name = "Analytics Integration"; Type = "service" },
    @{File = "APIIntegrationPage.jsx"; Name = "API Integration"; Type = "service" },
    @{File = "SimulationIntegrationPage.jsx"; Name = "Simulation Integration"; Type = "service" },
    @{File = "TaxTrackerPage.jsx"; Name = "Tax Tracker"; Type = "service" },
    @{File = "TurismoPage.jsx"; Name = "Turismo Incluyente"; Type = "service" },
    @{File = "AlojamientoPage.jsx"; Name = "Alojamiento Adaptado"; Type = "service" },
    @{File = "IngenieriaPage.jsx"; Name = "Ingeniería Creativa"; Type = "service" },
    @{File = "ToolkitsPage.jsx"; Name = "Toolkits"; Type = "service" },
    @{File = "DiagLogPerfPage.jsx"; Name = "Diagnóstico, Logging y Performance"; Type = "service" },
    @{File = "BrandingPage.jsx"; Name = "Branding"; Type = "service" },
    @{File = "DocsStructPage.jsx"; Name = "Documentación Estructurada"; Type = "service" },
    @{File = "Integracion3DPage.jsx"; Name = "Integración 3D"; Type = "service" },
    @{File = "ConsultoriaPage.jsx"; Name = "Consultoría Modular"; Type = "service" },
    @{File = "CapacitacionPage.jsx"; Name = "Capacitación"; Type = "service" },
    @{File = "SoportePage.jsx"; Name = "Soporte y Actualización"; Type = "service" },
    @{File = "SolucionesMedidaPage.jsx"; Name = "Soluciones a Medida"; Type = "service" },
    @{File = "ValidationPage.jsx"; Name = "Validación"; Type = "service" },
    @{File = "LoggingPage.jsx"; Name = "Logging"; Type = "service" },
    @{File = "DiagnosticoPage.jsx"; Name = "Diagnóstico"; Type = "service" },
    @{File = "PerformancePage.jsx"; Name = "Performance"; Type = "service" },
    @{File = "ManualesPage.jsx"; Name = "Manuales"; Type = "documentation" },
    @{File = "DiagramasFlujosPage.jsx"; Name = "Diagramas de Flujos"; Type = "documentation" },
    @{File = "GuiasInstalacionPage.jsx"; Name = "Guías de Instalación"; Type = "documentation" },
    @{File = "PortfolioReelsPage.jsx"; Name = "Portfolio"; Type = "portfolio" },
    @{File = "Renders3DGalleryPage.jsx"; Name = "Renders 3D"; Type = "portfolio" },
    @{File = "CotizacionServiciosPage.jsx"; Name = "Cotización de Servicios"; Type = "page" },
    @{File = "PrivacyPage.jsx"; Name = "Privacidad"; Type = "page" },
    @{File = "TermsPage.jsx"; Name = "Términos y Condiciones"; Type = "page" },
    @{File = "LicensesPage.jsx"; Name = "Licencias"; Type = "page" },
    @{File = "RadioNocaimaPageFixed.jsx"; Name = "Radio Nocaima"; Type = "project" },
    @{File = "XlerionGreenWavePage.jsx"; Name = "Xlerion GreenWave"; Type = "project" },
    @{File = "ThreeJSIntersectionPage.jsx"; Name = "Three.JS Intersection Demo"; Type = "project" }
)

$basePath = "X:\Programacion\XlerionWeb\xlerion-site\src\pages"

foreach ($page in $pages) {
    $filePath = Join-Path $basePath $page.File
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Check if useAnalytics is already imported
        if ($content -notmatch "useAnalytics") {
            Write-Host "Adding analytics to $($page.File)..." -ForegroundColor Green
            
            # Add import after other imports
            $content = $content -replace "(import { useLanguage } from [^\n]+\n)", "`$1import { useAnalytics } from '../hooks/useAnalytics';`n"
            
            # Add hook call after const { t } = useLanguage();
            $content = $content -replace "(const { t } = useLanguage\(\);)", "`$1`n    useAnalytics('$($page.Name)', '$($page.Type)');"
            
            Set-Content -Path $filePath -Value $content -NoNewline
            Write-Host "  ✓ Analytics added" -ForegroundColor Cyan
        }
        else {
            Write-Host "Skipping $($page.File) - already has analytics" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "File not found: $($page.File)" -ForegroundColor Red
    }
}

Write-Host "`n✓ Analytics integration complete!" -ForegroundColor Green
