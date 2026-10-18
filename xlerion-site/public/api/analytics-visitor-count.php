<?php
/**
 * Visitor Counter API
 * Returns total visitor count across entire site from xlerionc_proyectos database
 * Used by FooterVisitorCounter component
 * 
 * Real-only mode: returns errors if DB is unavailable
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database connection details (environment variables)
$host = getenv('ANALYTICS_DB_HOST') ?: null;
$port = getenv('ANALYTICS_DB_PORT') ?: 3306;
$database = getenv('ANALYTICS_DB_NAME') ?: null;
$username = getenv('ANALYTICS_DB_USER') ?: null;
$password = getenv('ANALYTICS_DB_PASS') ?: null;

if (!$host || !$username || !$password || !$database) {
    sendSuccess([
        'unique_visitors' => 0,
        'total_views' => 0,
        'today_visitors' => 0,
        'configured' => false
    ]);
}

// Return error response
function sendError($message, $code = 500) {
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'error' => $message,
        'timestamp' => date('c')
    ]);
    exit;
}

// Return success response
function sendSuccess($data) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $data,
        'timestamp' => date('c')
    ]);
    exit;
}

try {
    // Log the attempt
    error_log('[Analytics] Attempting DB connection to ' . $host . ':' . $port . ' DB: ' . $database);
    
    // Create PDO connection string
    $dsn = "mysql:host=$host;port=$port;dbname=$database;charset=utf8mb4";
    
    // Try to connect to database using PDO
    $connection = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    // FILTER: Only count visits from February 4, 2026 onwards (new system launch)
    $startDate = '2026-02-04 00:00:00';
    
    // Get total unique visitors (distinct IPs) since launch
    $stmtUnique = $connection->prepare("SELECT COUNT(DISTINCT client_ip) as unique_visitors FROM page_views WHERE created_at >= ?");
    $stmtUnique->execute([$startDate]);
    $uniqueRow = $stmtUnique->fetch();
    $uniqueVisitors = intval($uniqueRow['unique_visitors'] ?? 0);
    
    // Get total page views since launch
    $stmtTotal = $connection->prepare("SELECT COUNT(*) as total_views FROM page_views WHERE created_at >= ?");
    $stmtTotal->execute([$startDate]);
    $totalRow = $stmtTotal->fetch();
    $totalViews = intval($totalRow['total_views'] ?? 0);
    
    // Get today's visitors
    $stmtToday = $connection->prepare("SELECT COUNT(DISTINCT client_ip) as today_visitors FROM page_views WHERE DATE(created_at) = CURDATE()");
    $stmtToday->execute();
    $todayRow = $stmtToday->fetch();
    $todayVisitors = intval($todayRow['today_visitors'] ?? 0);
    
    // Close connection
    $connection = null;
    
    error_log('[Analytics] Success - Visitors: ' . $uniqueVisitors . ', Views: ' . $totalViews . ', Today: ' . $todayVisitors);
    
    // Return success with real data
    sendSuccess([
        'unique_visitors' => $uniqueVisitors,
        'total_views' => $totalViews,
        'today_visitors' => $todayVisitors
    ]);
    
} catch (PDOException $e) {
    error_log('[Analytics] PDO Exception: ' . $e->getMessage());
    sendError('Database connection error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    error_log('[Analytics] Exception: ' . $e->getMessage() . ' | ' . $e->getTraceAsString());
    sendError('Server error', 500);
}
