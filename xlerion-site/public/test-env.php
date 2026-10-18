<?php
/**
 * Script de diagnóstico - verificar configuración del .env
 * ELIMINAR DESPUÉS DE VERIFICAR (contiene info sensible)
 */

header('Content-Type: text/plain');

echo "=== DIAGNÓSTICO DE CONFIGURACIÓN ===\n\n";

// 1. Verificar si config.php existe
$configPath = __DIR__ . '/api/config.php';
echo "1. Config.php existe: " . (file_exists($configPath) ? "✓ SÍ" : "✗ NO") . "\n";
echo "   Ruta: $configPath\n\n";

// 2. Intentar cargar config.php
if (file_exists($configPath)) {
    require_once $configPath;
    echo "2. Config.php cargado: ✓\n\n";
} else {
    echo "2. Config.php cargado: ✗ ERROR\n\n";
}

// 3. Verificar variables de entorno
echo "3. Variables de entorno:\n";
$vars = [
    'ANALYTICS_DB_HOST',
    'ANALYTICS_DB_PORT',
    'ANALYTICS_DB_NAME',
    'ANALYTICS_DB_USER',
    'ANALYTICS_DB_PASS'
];

foreach ($vars as $var) {
    $value = getenv($var);
    if ($value) {
        // Ocultar contraseña
        if ($var === 'ANALYTICS_DB_PASS') {
            echo "   $var: [CONFIGURADA - " . strlen($value) . " caracteres]\n";
        } else {
            echo "   $var: $value\n";
        }
    } else {
        echo "   $var: ✗ NO CONFIGURADA\n";
    }
}

echo "\n4. Buscar archivo .env:\n";
$envPaths = [
    __DIR__ . '/.env',
    __DIR__ . '/../.env',
    dirname(__DIR__) . '/.env',
    dirname(__DIR__, 2) . '/.env',
];

foreach ($envPaths as $path) {
    $exists = file_exists($path);
    echo "   " . ($exists ? "✓" : "✗") . " $path\n";
    if ($exists) {
        echo "      Tamaño: " . filesize($path) . " bytes\n";
        echo "      Permisos: " . substr(sprintf('%o', fileperms($path)), -4) . "\n";
    }
}

echo "\n5. Test de conexión a BD:\n";
$host = getenv('ANALYTICS_DB_HOST') ?: 'NO CONFIGURADO';
$port = getenv('ANALYTICS_DB_PORT') ?: '3306';
$user = getenv('ANALYTICS_DB_USER') ?: 'NO CONFIGURADO';
$pass = getenv('ANALYTICS_DB_PASS') ?: 'NO CONFIGURADO';
$db = getenv('ANALYTICS_DB_NAME') ?: 'NO CONFIGURADO';

if ($host !== 'NO CONFIGURADO' && $user !== 'NO CONFIGURADO' && $pass !== 'NO CONFIGURADO') {
    try {
        $pdo = new PDO(
            "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4",
            $user,
            $pass,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 5]
        );
        echo "   ✓ Conexión exitosa a $db\n";
        
        // Verificar si existen las tablas
        $tables = ['page_views', 'page_view_pings', 'user_events', 'sessions'];
        foreach ($tables as $table) {
            $result = $pdo->query("SHOW TABLES LIKE '$table'")->fetch();
            echo "   " . ($result ? "✓" : "✗") . " Tabla '$table'\n";
        }
    } catch (PDOException $e) {
        echo "   ✗ Error de conexión: " . $e->getMessage() . "\n";
    }
} else {
    echo "   ✗ No se puede probar (faltan variables)\n";
}

echo "\n=== FIN DEL DIAGNÓSTICO ===\n";
echo "\n⚠️ ELIMINA ESTE ARCHIVO DESPUÉS DE VERIFICAR ⚠️\n";
?>
