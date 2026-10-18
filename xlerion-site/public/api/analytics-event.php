<?php
/**
 * Analytics Events - Rastrear eventos personalizados (clicks, descargas, etc)
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

if (!$input || !isset($input['sessionId']) || !isset($input['eventName'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

function getClientIP() {
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        return $_SERVER['HTTP_CF_CONNECTING_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ips[0]);
    } elseif (!empty($_SERVER['REMOTE_ADDR'])) {
        return $_SERVER['REMOTE_ADDR'];
    }
    return 'unknown';
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
    
    $stmt = $pdo->prepare("
        INSERT INTO user_events 
        (session_id, event_name, event_data, page_title, client_ip, created_at)
        VALUES 
        (:session_id, :event_name, :event_data, :page_title, :client_ip, :created_at)
    ");
    
    $stmt->execute([
        ':session_id' => $input['sessionId'],
        ':event_name' => $input['eventName'],
        ':event_data' => json_encode($input['eventData'] ?? []),
        ':page_title' => $input['pageTitle'] ?? 'Unknown',
        ':client_ip' => getClientIP(),
        ':created_at' => $input['timestamp'] ?? date('Y-m-d H:i:s')
    ]);
    
    http_response_code(200);
    echo json_encode(['success' => true]);
    
} catch (Exception $e) {
    error_log('Analytics event error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Event tracking failed']);
}
?>
