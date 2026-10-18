<#
Start the frontend static server and ensure the Laravel backend is running.

Behavior:
- If a process is already listening on port 8000, the script assumes the backend is running.
- Otherwise it launches the backend wrapper `run-artisan-service.ps1` (which restarts artisan in a loop)
  as a background process under the current user.
- After ensuring backend is running, it starts the frontend static server in the current terminal
  using `python -m http.server 5174` from `public/` so you can see the stdout.

Usage (from project root):
  pwsh -NoProfile -ExecutionPolicy Bypass -File .\el-ropero\scripts\start-frontend-with-backend.ps1
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRoot = 'X:\Programacion\XlerionWeb'
$frontendPublic = Join-Path $repoRoot 'ropero_project\el-ropero\public'
$backendWrapper = Join-Path $repoRoot 'ropero_project\backend\laravel\scripts\run-artisan-service.ps1'

function Write-Log { param($m) $t = (Get-Date).ToString('HH:mm:ss'); Write-Output "[$t] $m" }

if (-not (Test-Path $frontendPublic)) { Write-Error "Frontend public folder not found: $frontendPublic"; exit 1 }
if (-not (Test-Path $backendWrapper)) { Write-Warning "Backend wrapper not found: $backendWrapper`nFalling back to direct artisan serve start." }

Write-Log 'Checking if backend is already listening on port 8000...'
try { $conn = Get-NetTCPConnection -LocalPort 8000 -ErrorAction Stop } catch { $conn = $null }
if ($conn) {
    Write-Log 'Port 8000 in use — assuming backend is running.'
}
else {
    Write-Log 'No listener on port 8000. Starting backend wrapper in background.'

    $pwsh = (Get-Command pwsh -ErrorAction SilentlyContinue).Source
    if (-not $pwsh) { $pwsh = "$env:WINDIR\System32\WindowsPowerShell\v1.0\powershell.exe" }

    if (Test-Path $backendWrapper) {
        $arg = "-NoProfile -ExecutionPolicy Bypass -File `"$backendWrapper`""
        $proc = Start-Process -FilePath $pwsh -ArgumentList $arg -WindowStyle Hidden -PassThru
        Write-Log "Started backend wrapper (PID $($proc.Id)). Waiting for backend to bind..."
    }
    else {
        # fallback: start artisan serve directly
        $artisan = Join-Path (Split-Path $backendWrapper -Parent) '..\laravel\artisan'
        $artisan = (Resolve-Path -Path $artisan -ErrorAction SilentlyContinue).ProviderPath
        if ($artisan) {
            $php = (Get-Command php -ErrorAction SilentlyContinue).Source
            if (-not $php) { $php = 'php' }
            $backendDir = Join-Path $repoRoot 'ropero_project\backend\laravel'
            $proc = Start-Process -FilePath $php -ArgumentList 'artisan', 'serve', '--host=127.0.0.1', '--port=8000' -WorkingDirectory $backendDir -WindowStyle Hidden -PassThru
            Write-Log "Started artisan serve (PID $($proc.Id)) as fallback. Waiting for backend to bind..."
        }
        else {
            Write-Warning 'Could not find artisan; backend cannot be started automatically.'
        }
    }

    # Wait up to 15s for port bind
    $tries = 0
    while ($tries -lt 30) {
        Start-Sleep -Milliseconds 500
        try { $conn = Get-NetTCPConnection -LocalPort 8000 -ErrorAction Stop } catch { $conn = $null }
        if ($conn) { break }
        $tries++
    }
    if ($conn) { Write-Log 'Backend listening on port 8000.' } else { Write-Warning 'Backend did not bind to port 8000 yet. Check logs.' }
}

Write-Log "Starting frontend static server in: $frontendPublic"
Push-Location $frontendPublic

try {
    # Prefer python3 if available, else python
    $py = (Get-Command python3 -ErrorAction SilentlyContinue).Source
    if (-not $py) { $py = (Get-Command python -ErrorAction SilentlyContinue).Source }
    if (-not $py) { Write-Error 'Python not found in PATH. Please install Python or adjust PATH.'; exit 1 }

    Write-Log "Running: $py -m http.server 5174"
    & $py -m http.server 5174
}
finally {
    Pop-Location
}
