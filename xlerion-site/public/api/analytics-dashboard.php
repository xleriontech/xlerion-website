<?php
/**
 * Dashboard de Analytics - Visualizar datos recolectados
 * Protegido por autenticación básica
 */

require_once __DIR__ . '/config.php';

// Autenticación simple (por variables de entorno)
$validUser = getenv('ANALYTICS_DASH_USER') ?: 'secure_admin_' . substr(md5('secure_salt'), 0, 8);
$validPass = getenv('ANALYTICS_DASH_PASS') ?: substr(md5('secure_salt'), 0, 12);

if (!$validPass) {
    header('HTTP/1.0 500 Internal Server Error');
    echo 'Dashboard auth not configured';
    exit;
}

if (!isset($_SERVER['PHP_AUTH_USER']) || $_SERVER['PHP_AUTH_USER'] !== $validUser || 
    $_SERVER['PHP_AUTH_PW'] !== $validPass) {
    header('WWW-Authenticate: Basic realm="Xlerion Analytics"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Acceso denegado';
    exit;
}

$dbHost = getenv('ANALYTICS_DB_HOST') ?: null;
$dbPort = getenv('ANALYTICS_DB_PORT') ?: '3306';
$dbUser = getenv('ANALYTICS_DB_USER') ?: null;
$dbPass = getenv('ANALYTICS_DB_PASS') ?: null;
$dbName = getenv('ANALYTICS_DB_NAME') ?: null;

if (!$dbHost || !$dbUser || !$dbPass || !$dbName) {
    http_response_code(500);
    echo 'Analytics DB not configured';
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
    die('Error de conexión: ' . $e->getMessage());
}

// Obtener período de análisis
$days = isset($_GET['days']) ? (int)$_GET['days'] : 7;
$startDate = date('Y-m-d H:i:s', strtotime("-$days days"));
$endDate = date('Y-m-d H:i:s');

// Estadísticas generales
$stats = $pdo->query("
    SELECT 
        COUNT(*) as total_views,
        COUNT(DISTINCT session_id) as unique_sessions,
        COUNT(DISTINCT client_ip) as unique_ips,
        AVG(time_spent_ms) as avg_time_ms,
        MAX(time_spent_ms) as max_time_ms
    FROM page_views
    WHERE created_at BETWEEN '$startDate' AND '$endDate'
")->fetch(PDO::FETCH_ASSOC);

// Top 10 páginas
$topPages = $pdo->query("
    SELECT 
        page_title,
        COUNT(*) as views,
        COUNT(DISTINCT session_id) as unique_visitors,
        AVG(time_spent_ms) / 1000 as avg_time_seconds
    FROM page_views
    WHERE created_at BETWEEN '$startDate' AND '$endDate'
    GROUP BY page_title
    ORDER BY views DESC
    LIMIT 10
")->fetchAll(PDO::FETCH_ASSOC);

// Top 10 eventos
$topEvents = $pdo->query("
    SELECT 
        event_name,
        COUNT(*) as count,
        COUNT(DISTINCT session_id) as unique_sessions
    FROM user_events
    WHERE created_at BETWEEN '$startDate' AND '$endDate'
    GROUP BY event_name
    ORDER BY count DESC
    LIMIT 10
")->fetchAll(PDO::FETCH_ASSOC);

// Visitantes por hora
$byHour = $pdo->query("
    SELECT 
        DATE_FORMAT(created_at, '%Y-%m-%d %H:00') as hour,
        COUNT(*) as views,
        COUNT(DISTINCT session_id) as sessions
    FROM page_views
    WHERE created_at BETWEEN '$startDate' AND '$endDate'
    GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d %H:00')
    ORDER BY hour DESC
    LIMIT 24
")->fetchAll(PDO::FETCH_ASSOC);

// Top IPs
$topIPs = $pdo->query("
    SELECT 
        client_ip,
        COUNT(*) as views,
        COUNT(DISTINCT session_id) as sessions,
        SUM(time_spent_ms) / 1000 as total_time_seconds
    FROM page_views
    WHERE created_at BETWEEN '$startDate' AND '$endDate'
    GROUP BY client_ip
    ORDER BY views DESC
    LIMIT 20
")->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Dashboard - Xlerion</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0f0f0f;
            color: #fff;
            padding: 20px;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        h1 { margin-bottom: 30px; color: #00e9fa; }
        .filter-bar {
            background: #1a1a1a;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .filter-bar a {
            padding: 8px 16px;
            background: #00e9fa;
            color: #000;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
        }
        .filter-bar a.active { background: #00b8d4; }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background: #1a1a1a;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #333;
        }
        .card h2 {
            color: #00e9fa;
            font-size: 14px;
            text-transform: uppercase;
            margin-bottom: 10px;
            opacity: 0.8;
        }
        .card .number {
            font-size: 32px;
            font-weight: bold;
            color: #fff;
        }
        .card .label {
            color: #999;
            font-size: 12px;
            margin-top: 10px;
        }
        .table-container {
            background: #1a1a1a;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            overflow-x: auto;
        }
        .table-container h3 {
            color: #00e9fa;
            margin-bottom: 15px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background: #262626;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #00e9fa;
            border-bottom: 2px solid #00e9fa;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #333;
        }
        tr:hover { background: #252525; }
        .metric { color: #00e9fa; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Dashboard de Analytics - Xlerion</h1>
        
        <div class="filter-bar">
            <strong>Período:</strong>
            <a href="?days=1" <?php if($days==1) echo 'class="active"'; ?>>Hoy</a>
            <a href="?days=7" <?php if($days==7) echo 'class="active"'; ?>>7 días</a>
            <a href="?days=30" <?php if($days==30) echo 'class="active"'; ?>>30 días</a>
            <a href="?days=90" <?php if($days==90) echo 'class="active"'; ?>>90 días</a>
            <span style="margin-left: auto; color: #999;">
                <?php echo date('Y-m-d', strtotime("-$days days")); ?> a <?php echo date('Y-m-d'); ?>
            </span>
        </div>

        <div class="grid">
            <div class="card">
                <h2>Total de Vistas</h2>
                <div class="number"><?php echo number_format($stats['total_views']); ?></div>
                <div class="label">páginas vistas</div>
            </div>
            
            <div class="card">
                <h2>Sesiones Únicas</h2>
                <div class="number"><?php echo number_format($stats['unique_sessions']); ?></div>
                <div class="label">visitantes únicos</div>
            </div>
            
            <div class="card">
                <h2>IPs Únicas</h2>
                <div class="number"><?php echo number_format($stats['unique_ips']); ?></div>
                <div class="label">direcciones IP</div>
            </div>
            
            <div class="card">
                <h2>Tiempo Promedio</h2>
                <div class="number"><?php echo round($stats['avg_time_ms'] / 1000, 1); ?>s</div>
                <div class="label">por página</div>
            </div>
        </div>

        <div class="table-container">
            <h3>🔝 Top 10 Páginas Más Vistas</h3>
            <table>
                <thead>
                    <tr>
                        <th>Página</th>
                        <th class="metric">Vistas</th>
                        <th class="metric">Visitantes Únicos</th>
                        <th class="metric">Tiempo Promedio</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($topPages as $page): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($page['page_title']); ?></td>
                        <td class="metric"><?php echo number_format($page['views']); ?></td>
                        <td class="metric"><?php echo number_format($page['unique_visitors']); ?></td>
                        <td class="metric"><?php echo round($page['avg_time_seconds'], 1); ?>s</td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <div class="table-container">
            <h3>⚡ Top 10 Eventos</h3>
            <table>
                <thead>
                    <tr>
                        <th>Evento</th>
                        <th class="metric">Total</th>
                        <th class="metric">Sesiones Únicas</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($topEvents as $event): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($event['event_name']); ?></td>
                        <td class="metric"><?php echo number_format($event['count']); ?></td>
                        <td class="metric"><?php echo number_format($event['unique_sessions']); ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <div class="table-container">
            <h3>🌐 Top 20 IPs</h3>
            <table>
                <thead>
                    <tr>
                        <th>IP</th>
                        <th class="metric">Vistas</th>
                        <th class="metric">Sesiones</th>
                        <th class="metric">Tiempo Total (s)</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($topIPs as $ip): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($ip['client_ip']); ?></td>
                        <td class="metric"><?php echo number_format($ip['views']); ?></td>
                        <td class="metric"><?php echo number_format($ip['sessions']); ?></td>
                        <td class="metric"><?php echo round($ip['total_time_seconds'], 1); ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
