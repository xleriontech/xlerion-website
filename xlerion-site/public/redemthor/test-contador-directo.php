<?php
/**
 * Test directo del contador (sin servidor web)
 */

// Simular variables de servidor
$_SERVER['REMOTE_ADDR'] = '127.0.0.1';
$_SERVER['HTTP_USER_AGENT'] = 'TestBot/1.0';
$_SERVER['REQUEST_METHOD'] = 'GET';
$_GET['action'] = 'get';

echo "╔═══════════════════════════════════════════════════════════════════════════╗\n";
echo "║           🧪 TEST CONTADOR GLOBAL - REDEMTHOR (PHP directo)              ║\n";
echo "╚═══════════════════════════════════════════════════════════════════════════╝\n\n";

// Test 1: GET inicial
echo "📊 Test 1: GET contador inicial\n";
$_GET['action'] = 'get';
ob_start();
require __DIR__ . '/api/contador.php';
$response1 = ob_get_clean();
echo "   Respuesta: " . $response1 . "\n\n";

// Esperar un momento
sleep(1);

// Test 2: POST count (incrementar)
echo "📈 Test 2: POST count (incrementar)\n";
$_SERVER['REQUEST_METHOD'] = 'POST';
$_GET['action'] = 'count';
$_POST['action'] = 'count';
ob_start();
require __DIR__ . '/api/contador.php';
$response2 = ob_get_clean();
echo "   Respuesta: " . $response2 . "\n\n";

// Test 3: GET después de incrementar
echo "📊 Test 3: GET contador después de incrementar\n";
$_SERVER['REQUEST_METHOD'] = 'GET';
$_GET['action'] = 'get';
unset($_POST['action']);
ob_start();
require __DIR__ . '/api/contador.php';
$response3 = ob_get_clean();
echo "   Respuesta: " . $response3 . "\n\n";

// Test 4: Verificar archivos
echo "📁 Test 4: Verificar archivos creados\n";
$counterFile = __DIR__ . '/data/contador-visitas.txt';
$logFile = __DIR__ . '/data/visitas-log.txt';

if (file_exists($counterFile)) {
    $count = file_get_contents($counterFile);
    echo "   ✅ contador-visitas.txt existe (valor: $count)\n";
} else {
    echo "   ❌ contador-visitas.txt NO existe\n";
}

if (file_exists($logFile)) {
    $lines = count(file($logFile, FILE_SKIP_EMPTY_LINES));
    echo "   ✅ visitas-log.txt existe ($lines líneas)\n";
} else {
    echo "   ❌ visitas-log.txt NO existe\n";
}

echo "\n╔═══════════════════════════════════════════════════════════════════════════╗\n";
echo "║                         ✅ TESTS COMPLETADOS                              ║\n";
echo "╚═══════════════════════════════════════════════════════════════════════════╝\n";
