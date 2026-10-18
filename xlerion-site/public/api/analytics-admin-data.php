<?php
/**
 * Analytics Admin Data API (protected by session)
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

session_start();
if (!isset($_SESSION['analytics_admin']) || $_SESSION['analytics_admin'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 200;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
$limit = max(1, min($limit, 500));
$offset = max(0, $offset);

$dbHost = getenv('ANALYTICS_DB_HOST') ?: null;
$dbPort = getenv('ANALYTICS_DB_PORT') ?: '3306';
$dbUser = getenv('ANALYTICS_DB_USER') ?: null;
$dbPass = getenv('ANALYTICS_DB_PASS') ?: null;
$dbName = getenv('ANALYTICS_DB_NAME') ?: null;

if (!$dbHost || !$dbUser || !$dbPass || !$dbName) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => [
            'summary' => [
                'total_views' => 0,
                'unique_visitors' => 0,
                'today_visitors' => 0,
                'total_sessions' => 0,
                'total_events' => 0,
                'configured' => false
            ],
            'page_views' => [],
            'page_view_pings' => [],
            'user_events' => [],
            'sessions' => [],
            'top_pages' => [],
            'event_summary' => [],
            'limit' => $limit,
            'offset' => $offset
        ]
    ]);
    exit;
}

try {
    $pdo = new PDO(
        "mysql:host=$dbHost;port=$dbPort;dbname=$dbName;charset=utf8mb4",
        $dbUser,
        $dbPass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 5,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ]
    );

    $summary = [
        'total_views' => intval($pdo->query("SELECT COUNT(*) FROM page_views")->fetchColumn()),
        'unique_visitors' => intval($pdo->query("SELECT COUNT(DISTINCT client_ip) FROM page_views")->fetchColumn()),
        'today_visitors' => intval($pdo->query("SELECT COUNT(DISTINCT client_ip) FROM page_views WHERE DATE(created_at) = CURDATE()")->fetchColumn()),
        'total_sessions' => intval($pdo->query("SELECT COUNT(*) FROM sessions")->fetchColumn()),
        'total_events' => intval($pdo->query("SELECT COUNT(*) FROM user_events")->fetchColumn()),
        'configured' => true,
    ];

    $stmtViews = $pdo->prepare("SELECT * FROM page_views ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
    $stmtViews->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmtViews->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmtViews->execute();
    $pageViews = $stmtViews->fetchAll();

    $stmtPings = $pdo->prepare("SELECT * FROM page_view_pings ORDER BY updated_at DESC LIMIT :limit OFFSET :offset");
    $stmtPings->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmtPings->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmtPings->execute();
    $pagePings = $stmtPings->fetchAll();

    $stmtEvents = $pdo->prepare("SELECT * FROM user_events ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
    $stmtEvents->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmtEvents->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmtEvents->execute();
    $userEvents = $stmtEvents->fetchAll();

    $stmtSessions = $pdo->prepare("SELECT * FROM sessions ORDER BY started_at DESC LIMIT :limit OFFSET :offset");
    $stmtSessions->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmtSessions->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmtSessions->execute();
    $sessions = $stmtSessions->fetchAll();

    $stmtTopPages = $pdo->prepare("SELECT * FROM top_pages ORDER BY view_date DESC, total_views DESC LIMIT :limit");
    $stmtTopPages->bindValue(':limit', min($limit, 200), PDO::PARAM_INT);
    $stmtTopPages->execute();
    $topPages = $stmtTopPages->fetchAll();

    $stmtEventSummary = $pdo->prepare("SELECT * FROM event_summary ORDER BY event_date DESC, total_events DESC LIMIT :limit");
    $stmtEventSummary->bindValue(':limit', min($limit, 200), PDO::PARAM_INT);
    $stmtEventSummary->execute();
    $eventSummary = $stmtEventSummary->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => [
            'summary' => $summary,
            'page_views' => $pageViews,
            'page_view_pings' => $pagePings,
            'user_events' => $userEvents,
            'sessions' => $sessions,
            'top_pages' => $topPages,
            'event_summary' => $eventSummary,
            'limit' => $limit,
            'offset' => $offset
        ]
    ]);

} catch (Exception $e) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => [
            'summary' => [
                'total_views' => 0,
                'unique_visitors' => 0,
                'today_visitors' => 0,
                'total_sessions' => 0,
                'total_events' => 0,
                'configured' => false
            ],
            'page_views' => [],
            'page_view_pings' => [],
            'user_events' => [],
            'sessions' => [],
            'top_pages' => [],
            'event_summary' => [],
            'limit' => $limit,
            'offset' => $offset
        ]
    ]);
}
