# create_dist_zip.ps1
param(
    [string]$OutputDir = '.',
    [string]$DistDir = '.\dist'
)
Set-Location -Path $OutputDir
$ts = Get-Date -Format 'yyyyMMdd_HHmmss'
$zipName = "xlerion-site_build_$ts.zip"
$zipPath = Join-Path (Get-Location) $zipName
if (-not (Test-Path $DistDir)) {
    Write-Error "Dist directory not found: $DistDir"
    exit 1
}
Write-Host "Creating zip: $zipPath"
# Use wildcard to include all files inside the dist folder
Compress-Archive -Path "$DistDir\*" -DestinationPath $zipPath -Force
Write-Host "Zip created at: $zipPath"
Get-ChildItem -Path $zipPath | Format-List Name, Length
exit 0
