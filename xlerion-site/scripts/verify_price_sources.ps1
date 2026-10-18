# verify_price_sources.ps1
# Usage: Open PowerShell in xlerion-site and run: .\scripts\verify_price_sources.ps1
# This script checks the URLs defined as price sources and writes a JSON report to public/price_sources_report.json

$ErrorActionPreference = 'Stop'

$reportPath = Join-Path -Path (Resolve-Path "public") -ChildPath "price_sources_report.json"

# Define the list of sources to verify (keep in sync with CotizacionServiciosPage.jsx)
$sources = @{
    'desarrollo-web-movil'   = 'https://www.upwork.com/hire/web-developers/'
    'software-empresarial'   = 'https://www.goodfirms.co/directory/country/top-software-development-companies'
    'transformacion-digital' = 'https://www.mckinsey.com/business-functions/mckinsey-digital/our-insights'
    'tecnologias-blockchain' = 'https://consensys.io/blog'
    'diseño-branding'        = 'https://99designs.com/pricing'
    'marketing-digital'      = 'https://blog.hubspot.com/marketing/how-much-does-digital-marketing-cost'
    'videojuegos'            = 'https://www.gamedeveloper.com/'
    'modelado-3d'            = 'https://www.artstation.com/marketplace'
}

$result = @()

foreach ($key in $sources.Keys) {
    $url = $sources[$key]
    Write-Host "Checking [$key] -> $url" -ForegroundColor Cyan
    $entry = [ordered]@{
        key           = $key
        url           = $url
        checkedAt     = (Get-Date).ToString('yyyy-MM-ddTHH:mm:sszzz')
        ok            = $false
        status        = ''
        finalUrl      = ''
        contentType   = ''
        contentLength = 0
        error         = ''
    }

    try {
        # Try a HEAD request first
        try {
            $resp = Invoke-WebRequest -Uri $url -Method Head -MaximumRedirection 5 -TimeoutSec 15 -UseBasicParsing -ErrorAction Stop
        }
        catch {
            # Fallback to GET if HEAD is not supported or blocked
            $resp = Invoke-WebRequest -Uri $url -Method Get -MaximumRedirection 5 -TimeoutSec 15 -UseBasicParsing -ErrorAction Stop
        }

        # Extract final URL (ResponseUri may be in BaseResponse)
        $final = $null
        if ($resp.PSObject.Properties.Match('BaseResponse').Count -gt 0) {
            try { $final = $resp.BaseResponse.ResponseUri.AbsoluteUri } catch { $final = $null }
        }
        if (-not $final) { $final = $resp.Headers['Location'] -as [string] }
        if (-not $final) { $final = $url }

        $entry.finalUrl = $final
        $entry.status = if ($resp.StatusCode) { $resp.StatusCode } else { 200 }
        $entry.contentType = if ($resp.Headers['Content-Type']) { $resp.Headers['Content-Type'] } else { '' }
        try { $entry.contentLength = ($resp.Content | Out-String).Length } catch { $entry.contentLength = 0 }

        # Determine if page looks blank: very small content length or content-type not html
        $looksBlank = ($entry.contentLength -lt 500) -or (-not ($entry.contentType -like '*html*'))
        $entry.ok = -not $looksBlank
        if ($looksBlank) { $entry.status = "$($entry.status) (blank-or-non-html)" }

    }
    catch {
        $entry.error = $_.Exception.Message
        $entry.status = 'error'
        $entry.ok = $false
    }

    $result += (New-Object psobject -Property $entry)
}

# Write report as JSON
$result | ConvertTo-Json -Depth 5 | Out-File -FilePath $reportPath -Encoding UTF8

Write-Host "Report written to: $reportPath" -ForegroundColor Green

# Print summary
$okCount = ($result | Where-Object { $_.ok -eq $true }).Count
$total = $result.Count
Write-Host "Summary: $okCount / $total sources OK" -ForegroundColor Yellow

# Exit 0 if all OK, otherwise 2
if ($okCount -eq $total) { exit 0 } else { exit 2 }
