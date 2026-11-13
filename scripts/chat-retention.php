<?php
/**
 * Retencion de logs del Asistente Xlerion (90 dias).
 *
 * Uso local (cPanel > Cron Jobs, diario 03:00):
 *   php /home/USUARIO/scripts/chat-retention.php /home/USUARIO/xlerion-secrets/ai.php
 *
 * Tambien acepta la ruta por variable de entorno XLERION_AI_CONFIG.
 * Solo se ejecuta por CLI: nunca debe exponerse via web.
 */
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit("CLI only\n");
}

$configPath = $argv[1] ?? getenv('XLERION_AI_CONFIG');
if (!is_string($configPath) || $configPath === '' || !is_file($configPath)) {
    fwrite(STDERR, "Config no encontrada. Pasa la ruta como argumento.\n");
    exit(1);
}

$config = require $configPath;
if (!is_array($config) || empty($config['db_dsn'])) {
    fwrite(STDERR, "Config invalida.\n");
    exit(1);
}

try {
    $pdo = new PDO($config['db_dsn'], $config['db_user'], $config['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $audit = $pdo->exec('DELETE FROM chat_audit WHERE created_at < NOW() - INTERVAL 90 DAY');
    $rate = $pdo->exec('DELETE FROM chat_rate WHERE window_start < NOW() - INTERVAL 1 DAY');
    echo "chat_audit: {$audit} filas eliminadas\n";
    echo "chat_rate: {$rate} filas eliminadas\n";
} catch (Throwable $e) {
    fwrite(STDERR, "Error: " . $e->getMessage() . "\n");
    exit(1);
}
