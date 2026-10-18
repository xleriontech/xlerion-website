<?php
/**
 * Test Database Connection
 * Quick script to verify MySQL connection
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

loadEnv();

$dbHost = getenv('ANALYTICS_DB_HOST') ?: 'NOT_SET';
$dbPort = getenv('ANALYTICS_DB_PORT') ?: '3306';
$dbUser = getenv('ANALYTICS_DB_USER') ?: 'NOT_SET';
$dbPass = getenv('ANALYTICS_DB_PASS') ?: 'NOT_SET';
$dbName = getenv('ANALYTICS_DB_NAME') ?: 'NOT_SET';

$result = [
    'config' => [
        'host' => $dbHost,
        'port' => $dbPort,
        'database' => $dbName,
        'username' => $dbUser,
        'password' => $dbPass === 'NOT_SET' ? 'NOT_SET' : (empty($dbPass) ? 'EMPTY' : 'SET (length: ' . strlen($dbPass) . ')')
    ],
    'connection' => null,
    'error' => null
];

if ($dbHost === 'NOT_SET' || $dbUser === 'NOT_SET' || $dbPass === 'NOT_SET' || empty($dbPass)) {
    $result['error'] = 'Missing or empty database credentials in .env file';
    echo json_encode($result, JSON_PRETTY_PRINT);
    exit;
}

try {
    $dsn = "mysql:host=$dbHost;port=$dbPort;dbname=$dbName;charset=utf8mb4";
    $pdo = new PDO(
        $dsn,
        $dbUser,
        $dbPass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 5,
        ]
    );
    
    $result['connection'] = 'SUCCESS';
    
    // Test query
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM page_views");
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    $result['test_query'] = "Found {$count['count']} page views in database";
    
} catch (PDOException $e) {
    $result['connection'] = 'FAILED';
    $result['error'] = $e->getMessage();
    $result['error_code'] = $e->getCode();
}

echo json_encode($result, JSON_PRETTY_PRINT);
?>
