<?php
/**
 * Reset Analytics Data (USE WITH CAUTION)
 * This script deletes ALL analytics data and starts fresh
 * Only run this ONCE when deploying the new system
 */

require_once __DIR__ . '/config.php';

// SECURITY: Require a secret key to prevent accidental resets
$requiredKey = 'RESET_ANALYTICS_2026'; // Change this to a secure random string

if (!isset($_GET['key']) || $_GET['key'] !== $requiredKey) {
    http_response_code(403);
    die('Forbidden: Invalid reset key');
}

header('Content-Type: application/json');

$host = getenv('ANALYTICS_DB_HOST') ?: null;
$port = getenv('ANALYTICS_DB_PORT') ?: 3306;
$database = getenv('ANALYTICS_DB_NAME') ?: null;
$username = getenv('ANALYTICS_DB_USER') ?: null;
$password = getenv('ANALYTICS_DB_PASS') ?: null;

if (!$host || !$username || !$password || !$database) {
    http_response_code(500);
    echo json_encode(['error' => 'DB not configured']);
    exit;
}

try {
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$database;charset=utf8mb4",
        $username,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // Truncate all analytics tables (keeps structure, deletes data)
    $pdo->exec("TRUNCATE TABLE page_views");
    $pdo->exec("TRUNCATE TABLE page_view_pings");
    $pdo->exec("TRUNCATE TABLE user_events");
    $pdo->exec("TRUNCATE TABLE sessions");

    echo json_encode([
        'success' => true,
        'message' => 'All analytics data has been reset',
        'timestamp' => date('Y-m-d H:i:s')
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Reset failed',
        'message' => $e->getMessage()
    ]);
}
