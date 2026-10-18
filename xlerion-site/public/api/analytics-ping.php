<?php
/**
 * Analytics Ping - Registra actividad en vivo cada 30 segundos
 */

require_once __DIR__ . '/config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['sessionId'])) {
    http_response_code(400);
    exit;
}

// Configuración por variables de entorno
$dbHost = getenv('ANALYTICS_DB_HOST') ?: null;
$dbPort = getenv('ANALYTICS_DB_PORT') ?: '3306';
$dbUser = getenv('ANALYTICS_DB_USER') ?: null;
$dbPass = getenv('ANALYTICS_DB_PASS') ?: null;
$dbName = getenv('ANALYTICS_DB_NAME') ?: null;

if (!$dbHost || !$dbUser || !$dbPass || !$dbName) {
    http_response_code(200);
    echo json_encode(['success' => true, 'configured' => false]);
    exit;
}

try {
    $pdo = new PDO(
        "mysql:host=$dbHost;port=$dbPort;dbname=$dbName;charset=utf8mb4",
        $dbUser,
        $dbPass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ]
    );
    
    // Actualizar o crear ping
    $stmt = $pdo->prepare("
        INSERT INTO page_view_pings 
        (session_id, page_title, duration_ms, updated_at)
        VALUES 
        (:session_id, :page_title, :duration, :updated_at)
        ON DUPLICATE KEY UPDATE 
            duration_ms = :duration,
            updated_at = :updated_at
    ");
    
    $stmt->execute([
        ':session_id' => $input['sessionId'],
        ':page_title' => $input['pageTitle'] ?? 'Unknown',
        ':duration' => $input['duration'] ?? 0,
        ':updated_at' => $input['timestamp'] ?? date('Y-m-d H:i:s')
    ]);
    
    http_response_code(200);
    echo json_encode(['success' => true]);
    
} catch (Exception $e) {
    error_log('Analytics ping error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Ping failed']);
}
?>
