<?php
/**
 * Contador Global de Visitas - Redemthor (DB)
 *
 * Endpoints:
 * - GET  /api/contador.php?action=get    → Obtiene el contador actual
 * - POST /api/contador.php?action=count  → Incrementa el contador
 */

require_once __DIR__ . '/../../api/config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

define('COOLDOWN_MINUTES', 30);

function getClientIP() {
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        return $_SERVER['HTTP_CF_CONNECTING_IP'];
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ips[0]);
    }
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

$dbHost = getenv('ANALYTICS_DB_HOST') ?: null;
$dbPort = getenv('ANALYTICS_DB_PORT') ?: '3306';
$dbUser = getenv('ANALYTICS_DB_USER') ?: null;
$dbPass = getenv('ANALYTICS_DB_PASS') ?: null;
$dbName = getenv('ANALYTICS_DB_NAME') ?: null;

if (!$dbHost || !$dbUser || !$dbPass || !$dbName) {
    http_response_code(200);
    echo json_encode(['success' => true, 'count' => 0, 'configured' => false]);
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
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'DB connection failed']);
    exit;
}

function getVisitorCount($pdo) {
    return (int) $pdo->query('SELECT COUNT(*) FROM redemthor_visits')->fetchColumn();
}

function hasRecentVisit($pdo, $fingerprint) {
    $stmt = $pdo->prepare('SELECT created_at FROM redemthor_visits WHERE fingerprint = :fp ORDER BY created_at DESC LIMIT 1');
    $stmt->execute(['fp' => $fingerprint]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        return false;
    }
    $last = strtotime($row['created_at']);
    $cooldownSeconds = COOLDOWN_MINUTES * 60;
    return (time() - $last) < $cooldownSeconds;
}

function logVisit($pdo, $fingerprint, $ip, $userAgent) {
    $stmt = $pdo->prepare('INSERT INTO redemthor_visits (fingerprint, client_ip, user_agent, created_at) VALUES (:fp, :ip, :ua, NOW())');
    $stmt->execute([
        'fp' => $fingerprint,
        'ip' => $ip,
        'ua' => $userAgent
    ]);
}

$action = $_GET['action'] ?? $_POST['action'] ?? 'get';

try {
    switch ($action) {
        case 'get':
            $count = getVisitorCount($pdo);
            echo json_encode([
                'success' => true,
                'count' => $count,
                'action' => 'get'
            ]);
            break;

        case 'count':
            $ip = getClientIP();
            $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
            $fingerprint = md5($ip . '|' . $userAgent);

            if (hasRecentVisit($pdo, $fingerprint)) {
                $count = getVisitorCount($pdo);
                echo json_encode([
                    'success' => true,
                    'count' => $count,
                    'action' => 'count',
                    'incremented' => false,
                    'message' => 'Recent visit detected (cooldown active)'
                ]);
                break;
            }

            logVisit($pdo, $fingerprint, $ip, $userAgent);
            $count = getVisitorCount($pdo);
            echo json_encode([
                'success' => true,
                'count' => $count,
                'action' => 'count',
                'incremented' => true,
                'message' => 'Visit counted successfully'
            ]);
            break;

        default:
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Invalid action. Use action=get or action=count'
            ]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
