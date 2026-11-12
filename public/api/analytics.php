<?php
/**
 * Endpoint de analitica del sitio.
 *
 * Sustituye a las Cloudflare Functions archivadas en
 * .archive-cloudflare/functions/api/analytics/* (retiradas al migrar a
 * Apache/cPanel). Mantiene el mismo contrato que consume el front:
 *
 *   POST /api/analytics.php?action=pageview      -> { success: true }
 *   POST /api/analytics.php?action=ping          -> { success: true }
 *   POST /api/analytics.php?action=event         -> { success: true }
 *   GET  /api/analytics.php?action=visitor-count -> { success: true, data: {...} }
 *
 * Tambien funcionan las rutas con sub-path gracias a las reglas del
 * .htaccess:
 *   POST /api/analytics, /api/analytics/ping, /api/analytics/event
 *   GET  /api/analytics/visitor-count
 *
 * Almacenamiento:
 *   - JSONL en api/logs/analytics.jsonl (mismo mecanismo que scan.php).
 *   - Opcional: PostgreSQL via PDO si se define 'pg' en config.local.php.
 *
 * Ley 1581: la IP es dato personal. Se guarda enmascarada (/24) y con hash
 * con sal; el User-Agent se trunca. El contador de visitantes es un dato
 * agregado, no identifica a nadie.
 */

declare(strict_types=1);

mb_internal_encoding('UTF-8');

const ANALYTICS_MAX_BODY = 32768;

function analytics_config(): array
{
    $candidates = [];
    $fromEnv = getenv('XLERION_CARDS_CONFIG');
    if (is_string($fromEnv) && $fromEnv !== '') {
        $candidates[] = $fromEnv;
    }
    $candidates[] = __DIR__ . '/config.local.php';
    $candidates[] = dirname(__DIR__) . '/config.local.php';
    $candidates[] = dirname(dirname(__DIR__)) . '/config.local.php';

    $config = [];
    foreach ($candidates as $path) {
        if (is_file($path) && is_readable($path)) {
            $loaded = include $path;
            if (is_array($loaded)) {
                $config = $loaded;
            }
            break;
        }
    }

    $envMap = [
        'XLERION_ANALYTICS_SALT' => 'salt',
    ];
    foreach ($envMap as $env => $key) {
        $value = getenv($env);
        if (is_string($value) && $value !== '') {
            $config[$key] = $value;
        }
    }

    return $config + [
        'log_path'     => __DIR__ . '/logs/analytics.jsonl',
        'anonymize_ip' => true,
        'salt'         => 'xlerion-analytics-default-salt',
        // 'pg' => ['dsn' => 'pgsql:host=...;dbname=...', 'user' => '', 'pass' => ''],
    ];
}

function analytics_respond(array $payload, int $status): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function analytics_client_ip(): string
{
    $fwd = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if (is_string($fwd) && $fwd !== '') {
        $parts = array_map('trim', explode(',', $fwd));
        $candidate = end($parts);
        if (is_string($candidate) && filter_var($candidate, FILTER_VALIDATE_IP)) {
            return $candidate;
        }
    }
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    return is_string($ip) ? $ip : '';
}

function analytics_mask_ip(string $ip): string
{
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
        $parts = explode('.', $ip);
        return $parts[0] . '.' . $parts[1] . '.' . $parts[2] . '.0/24';
    }
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
        $packed = @inet_pton($ip);
        if ($packed !== false) {
            return (@inet_ntop(substr($packed, 0, 6)) ?: '::') . ':0/48';
        }
    }
    return '0.0.0.0';
}

function analytics_hash(string $ip, string $salt): string
{
    return substr(hash('sha256', $salt . '|' . $ip), 0, 32);
}

function analytics_truncate(string $value, int $max): string
{
    if (function_exists('mb_substr') && mb_strlen($value, 'UTF-8') > $max) {
        return mb_substr($value, 0, $max, 'UTF-8');
    }
    if (strlen($value) > $max) {
        return substr($value, 0, $max);
    }
    return $value;
}

/**
 * Lee el cuerpo JSON de la peticion.
 * Devuelve null si el cuerpo no es JSON valido (no se puede distinguir de
 * un objeto vacio "{}" usando solo el array, asi que se valida con
 * json_last_error()).
 */
function analytics_read_json(): ?array
{
    $raw = file_get_contents('php://input', false, null, 0, ANALYTICS_MAX_BODY);
    if (!is_string($raw) || trim($raw) === '') {
        return null;
    }
    $decoded = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
        return null;
    }
    return $decoded;
}

function analytics_append_jsonl(string $path, array $record): bool
{
    $dir = dirname($path);
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    $line = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (!is_string($line)) {
        return false;
    }
    return @file_put_contents($path, $line . PHP_EOL, FILE_APPEND | LOCK_EX) !== false;
}

function analytics_append_pg(array $config, array $record): bool
{
    $pg = $config['pg'] ?? null;
    if (!is_array($pg) || empty($pg['dsn'])) {
        return false;
    }
    try {
        $pdo = new PDO(
            (string) $pg['dsn'],
            (string) ($pg['user'] ?? ''),
            (string) ($pg['pass'] ?? ''),
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS site_analytics (
                id          BIGSERIAL PRIMARY KEY,
                session_id  TEXT NOT NULL,
                kind        TEXT NOT NULL,
                page_title  TEXT,
                page_type   TEXT,
                duration_ms INTEGER,
                ip_hash     TEXT,
                ip_address  TEXT,
                user_agent  TEXT,
                language    TEXT,
                referrer    TEXT,
                url         TEXT,
                hostname    TEXT,
                event_name  TEXT,
                event_data  TEXT,
                recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )'
        );
        $stmt = $pdo->prepare(
            'INSERT INTO site_analytics
                (session_id, kind, page_title, page_type, duration_ms, ip_hash, ip_address,
                 user_agent, language, referrer, url, hostname, event_name, event_data, recorded_at)
             VALUES (:session_id, :kind, :page_title, :page_type, :duration_ms, :ip_hash, :ip_address,
                 :user_agent, :language, :referrer, :url, :hostname, :event_name, :event_data, :recorded_at)'
        );
        $stmt->execute([
            ':session_id'  => $record['session_id'],
            ':kind'        => $record['kind'],
            ':page_title'  => $record['page_title'],
            ':page_type'   => $record['page_type'],
            ':duration_ms' => $record['duration_ms'],
            ':ip_hash'     => $record['ip_hash'],
            ':ip_address'  => $record['ip_address'],
            ':user_agent'  => $record['user_agent'],
            ':language'    => $record['language'],
            ':referrer'    => $record['referrer'],
            ':url'         => $record['url'],
            ':hostname'    => $record['hostname'],
            ':event_name'  => $record['event_name'],
            ':event_data'  => $record['event_data'],
            ':recorded_at' => $record['recorded_at'],
        ]);
        return true;
    } catch (Throwable $e) {
        error_log('[analytics.php] Postgres no disponible: ' . $e->getMessage());
        return false;
    }
}

/** Agregado: visitantes unicos, vistas totales y visitantes de hoy. */
function analytics_stats(string $path): array
{
    $out = [
        'unique_visitors' => 0,
        'total_views'     => 0,
        'today_visitors'  => 0,
    ];
    if (!is_file($path)) {
        return $out;
    }
    $fh = @fopen($path, 'rb');
    if ($fh === false) {
        return $out;
    }
    $sessions = [];
    $today = [];
    $todayKey = gmdate('Y-m-d');
    while (($line = fgets($fh)) !== false) {
        $line = trim($line);
        if ($line === '') {
            continue;
        }
        $rec = json_decode($line, true);
        if (!is_array($rec)) {
            continue;
        }
        if (($rec['kind'] ?? '') === 'pageview') {
            $out['total_views']++;
        }
        $sid = (string) ($rec['session_id'] ?? '');
        if ($sid !== '') {
            $sessions[$sid] = true;
            if (substr((string) ($rec['recorded_at'] ?? ''), 0, 10) === $todayKey) {
                $today[$sid] = true;
            }
        }
    }
    fclose($fh);
    $out['unique_visitors'] = count($sessions);
    $out['today_visitors']  = count($today);
    return $out;
}

/* ------------------------------------------------------------------ */

$action = strtolower(trim((string) ($_GET['action'] ?? '')));
if ($action === '') {
    // Compatibilidad con las rutas con sub-path (/api/analytics/ping, etc.)
    // cuando el servidor las sirve con PATH_INFO.
    $pathInfo = (string) ($_SERVER['PATH_INFO'] ?? '');
    if ($pathInfo !== '') {
        $action = strtolower(trim($pathInfo, '/'));
    }
}
if ($action === '' || $action === '/') {
    $action = 'pageview';
}
if ($action === 'visitor-count' || $action === 'visitor_count') {
    $action = 'visitor-count';
}

$config = analytics_config();

/* ---------------- Contador de visitantes (GET) ---------------- */
if ($action === 'visitor-count') {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
        analytics_respond(['success' => false, 'error' => 'Method not allowed'], 405);
    }
    analytics_respond([
        'success' => true,
        'data'    => analytics_stats((string) $config['log_path']),
    ], 200);
}

/* ---------------- Pageview / ping / event (POST) ---------------- */
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    analytics_respond(['success' => false, 'error' => 'Method not allowed'], 405);
}

$data = analytics_read_json();
if ($data === null) {
    analytics_respond(['success' => false, 'error' => 'Invalid JSON body'], 400);
}

$ip  = analytics_client_ip();
$now = gmdate('c');

$record = [
    'session_id'  => analytics_truncate((string) ($data['sessionId'] ?? ''), 120),
    'kind'        => $action,
    'page_title'  => analytics_truncate((string) ($data['pageTitle'] ?? ''), 200),
    'page_type'   => analytics_truncate((string) ($data['pageType'] ?? ''), 60),
    'duration_ms' => (int) ($data['timeSpent'] ?? $data['duration'] ?? 0),
    'ip_hash'     => analytics_hash($ip, (string) $config['salt']),
    'ip_address'  => $config['anonymize_ip'] ? analytics_mask_ip($ip) : $ip,
    'user_agent'  => analytics_truncate((string) ($data['userAgent'] ?? ''), 400),
    'language'    => analytics_truncate((string) ($data['language'] ?? ''), 20),
    'referrer'    => analytics_truncate((string) ($data['referrer'] ?? ''), 500),
    'url'         => analytics_truncate((string) ($data['url'] ?? ''), 500),
    'hostname'    => analytics_truncate((string) ($data['hostname'] ?? ''), 120),
    'event_name'  => analytics_truncate((string) ($data['eventName'] ?? ''), 120),
    'event_data'  => isset($data['eventData']) && is_array($data['eventData'])
        ? analytics_truncate((string) json_encode($data['eventData'], JSON_UNESCAPED_UNICODE), 2000)
        : '',
    'recorded_at' => $now,
];

$stored = analytics_append_pg($config, $record);
if (!$stored) {
    $stored = analytics_append_jsonl((string) $config['log_path'], $record);
}

analytics_respond(['success' => true], 200);
