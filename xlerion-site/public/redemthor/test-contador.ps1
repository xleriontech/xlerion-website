# Test del Contador Global - Redemthor
# Este script prueba el API del contador

Write-Host "╔═══════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           🧪 TEST CONTADOR GLOBAL - REDEMTHOR API                        ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080/redemthor/api/contador.php"

# Test 1: GET contador (sin incrementar)
Write-Host "📊 Test 1: GET contador actual" -ForegroundColor Yellow
Write-Host "URL: ${baseUrl}?action=get" -ForegroundColor Gray
try {
    $response1 = Invoke-RestMethod -Uri "${baseUrl}?action=get" -Method GET
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host "   Contador actual: $($response1.count)" -ForegroundColor White
    Write-Host "   Respuesta completa:" -ForegroundColor Gray
    $response1 | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor Gray
}
catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "─────────────────────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""

# Test 2: POST count (incrementar)
Write-Host "📈 Test 2: POST count (incrementar contador)" -ForegroundColor Yellow
Write-Host "URL: ${baseUrl}?action=count" -ForegroundColor Gray
try {
    $response2 = Invoke-RestMethod -Uri "${baseUrl}?action=count" -Method POST -ContentType 'application/json'
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host "   Contador después: $($response2.count)" -ForegroundColor White
    Write-Host "   ¿Incrementado?: $($response2.incremented)" -ForegroundColor White
    Write-Host "   Mensaje: $($response2.message)" -ForegroundColor White
    Write-Host "   Respuesta completa:" -ForegroundColor Gray
    $response2 | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor Gray
}
catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "─────────────────────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""

# Test 3: GET contador (verificar incremento)
Write-Host "📊 Test 3: GET contador (verificar cambio)" -ForegroundColor Yellow
Write-Host "URL: ${baseUrl}?action=get" -ForegroundColor Gray
try {
    $response3 = Invoke-RestMethod -Uri "${baseUrl}?action=get" -Method GET
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host "   Contador final: $($response3.count)" -ForegroundColor White
    Write-Host "   Respuesta completa:" -ForegroundColor Gray
    $response3 | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor Gray
}
catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "─────────────────────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""

# Test 4: POST count nuevamente (debería activar cooldown)
Write-Host "⏱️  Test 4: POST count nuevamente (cooldown test)" -ForegroundColor Yellow
Write-Host "URL: ${baseUrl}?action=count" -ForegroundColor Gray
Write-Host "Esperado: incremented=false (cooldown de 30 minutos activo)" -ForegroundColor Gray
try {
    $response4 = Invoke-RestMethod -Uri "${baseUrl}?action=count" -Method POST -ContentType 'application/json'
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host "   Contador: $($response4.count)" -ForegroundColor White
    Write-Host "   ¿Incrementado?: $($response4.incremented)" -ForegroundColor White
    Write-Host "   Mensaje: $($response4.message)" -ForegroundColor White
    
    if ($response4.incremented -eq $false) {
        Write-Host "   ✅ Cooldown funcionando correctamente" -ForegroundColor Green
    }
    else {
        Write-Host "   ⚠️  WARNING: Cooldown no activo (debería estar activo)" -ForegroundColor Yellow
    }
    
    Write-Host "   Respuesta completa:" -ForegroundColor Gray
    $response4 | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor Gray
}
catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "─────────────────────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""

# Verificar archivos creados
Write-Host "📁 Test 5: Verificar archivos en servidor" -ForegroundColor Yellow
$counterFile = "X:\Programacion\XlerionWeb\xlerion-site\public\redemthor\data\contador-visitas.txt"
$logFile = "X:\Programacion\XlerionWeb\xlerion-site\public\redemthor\data\visitas-log.txt"

if (Test-Path $counterFile) {
    $counterValue = Get-Content $counterFile
    Write-Host "   ✅ contador-visitas.txt existe" -ForegroundColor Green
    Write-Host "      Valor: $counterValue" -ForegroundColor White
}
else {
    Write-Host "   ❌ contador-visitas.txt NO existe" -ForegroundColor Red
}

if (Test-Path $logFile) {
    $logLines = (Get-Content $logFile | Measure-Object -Line).Lines
    Write-Host "   ✅ visitas-log.txt existe" -ForegroundColor Green
    Write-Host "      Líneas: $logLines" -ForegroundColor White
    if ($logLines -gt 0) {
        Write-Host "      Primera entrada:" -ForegroundColor Gray
        Get-Content $logFile | Select-Object -First 1 | Write-Host -ForegroundColor Gray
    }
}
else {
    Write-Host "   ❌ visitas-log.txt NO existe" -ForegroundColor Red
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                         ✅ TESTS COMPLETADOS                              ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Resumen:" -ForegroundColor White
Write-Host "  Contador inicial: $($response1.count)" -ForegroundColor White
Write-Host "  Contador final:   $($response3.count)" -ForegroundColor White
Write-Host "  Incremento:       $($response3.count - $response1.count)" -ForegroundColor White
Write-Host "  Cooldown activo:  $(if ($response4.incremented -eq $false) { '✅ Sí' } else { '❌ No' })" -ForegroundColor White
Write-Host ""
Write-Host "Para probar en navegador:" -ForegroundColor Yellow
Write-Host "  http://localhost:8080/redemthor/" -ForegroundColor Cyan
Write-Host ""
