<?php
/**
 * API de Analytics - Recibe y guarda datos de visitantes
 * Guarda: página, tiempo, IP, dispositivo, idioma, etc.
 */

require_once __DIR__ . '/config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Obtener datos JSON
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Función para obtener IP del cliente
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

// Conectar a base de datos remota (configurada por variables de entorno)
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
            PDO::ATTR_TIMEOUT => 5,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ]
    );
} catch (PDOException $e) {
    // Guardar en archivo local como fallback
    $logFile = __DIR__ . '/analytics-fallback.log';
    $logEntry = json_encode([
        'timestamp' => date('Y-m-d H:i:s'),
        'error' => $e->getMessage(),
        'data' => $input,
        'ip' => getClientIP()
    ]) . "\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND);
    
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed', 'saved_to_log' => true]);
    exit;
}

try {
    $clientIP = getClientIP();
    
    $stmt = $pdo->prepare("
        INSERT INTO page_views 
        (session_id, page_title, page_type, time_spent_ms, user_agent, language, 
         client_ip, screen_resolution, referrer_url, page_url, hostname, created_at)
        VALUES 
        (:session_id, :page_title, :page_type, :time_spent, :user_agent, :language,
         :client_ip, :screen_resolution, :referrer_url, :page_url, :hostname, :created_at)
    ");
    
    $stmt->execute([
        ':session_id' => $input['sessionId'] ?? null,
        ':page_title' => $input['pageTitle'] ?? 'Unknown',
        ':page_type' => $input['pageType'] ?? 'page',
        ':time_spent' => $input['timeSpent'] ?? 0,
        ':user_agent' => substr($input['userAgent'] ?? '', 0, 500),
        ':language' => $input['language'] ?? 'unknown',
        ':client_ip' => $clientIP,
        ':screen_resolution' => $input['screenResolution'] ?? 'unknown',
        ':referrer_url' => substr($input['referrer'] ?? '', 0, 500),
        ':page_url' => substr($input['url'] ?? '', 0, 500),
        ':hostname' => $input['hostname'] ?? 'unknown',
        ':created_at' => $input['timestamp'] ?? date('Y-m-d H:i:s')
    ]);
    
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Analytics tracked']);
    
} catch (Exception $e) {
    error_log('Analytics error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Tracking failed']);
}
?>
