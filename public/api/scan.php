<?php
/**
 * Endpoint de tracking de escaneos de las tarjetas digitales.
 *
 * GET /api/scan/{founder_id}          -> registra el escaneo y responde 302
 * GET /api/scan/{founder_id}?stats=1  -> devuelve el agregado en JSON
 *
 * El QR fisico y la tarjeta NFC apuntan aqui (y no a la tarjeta directa) para
 * que ambos canales compartan la misma metricas.
 *
 * El redirect devuelve a https://xlerion.com.co/{slug}:
 *   miguel   -> /mike
 *   juliette -> /juliette
 *
 * Almacenamiento:
 *   - Por defecto: JSONL en api/logs/scans.jsonl (sin dependencias, igual que
 *     el logging del endpoint de contacto).
 *   - Opcional: PostgreSQL via PDO si se define 'pg' en config.local.php.
 *     Si TimescaleDB esta montado sobre la misma conexion, las consultas
 *     hypertable funcionan sin cambios.
 */

declare(strict_types=1);

mb_internal_encoding('UTF-8');

const SCAN_FONDERS = [
    'miguel'   => ['slug' => 'mike',     'name' => 'Miguel E. Rodriguez Martinez'],
    'juliette' => ['slug' => 'juliette', 'name' => 'Juliette González'],
];

/**
 * Config local: mismo mecanismo que contact.php (fuera del webroot o
 * api/config.local.php bloqueado por .htaccess).
 */
function load_config(): array
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
        'XLERION_PUBLIC_BASE' => 'public_base',
        'XLERION_SCAN_SALT'   => 'salt',
    ];
    foreach ($envMap as $env => $key) {
        $value = getenv($env);
        if (is_string($value) && $value !== '') {
            $config[$key] = $value;
        }
    }

    return $config + [
        'public_base'    => 'https://xlerion.com.co',
        'log_path'       => __DIR__ . '/logs/scans.jsonl',
        // Ley 1581: la IP es dato personal. Por defecto se guarda enmascarada
        // (se conserva el /24) y ademas un hash con sal, que es lo que sirve
        // para contar visitantes unicos sin conservar la IP completa.
        'anonymize_ip'   => true,
        'salt'           => 'xlerion-cards-default-salt',
        // 'pg' => ['dsn' => 'pgsql:host=...;dbname=...', 'user' => '', 'pass' => ''],
    ];
}

function respond(array $payload, int $status): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function client_ip(): string
{
    // X-Forwarded-For lo inyecta el proxy/CDN; la ultima IP es el cliente real.
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

/** IPv4 -> /24 (conserva la red, elimina el host). IPv6 -> /48. */
function mask_ip(string $ip): string
{
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
        $parts = explode('.', $ip);
        return $parts[0] . '.' . $parts[1] . '.' . $parts[2] . '.0/24';
    }
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
        $packed = inet_pton($ip);
        if ($packed !== false) {
            $prefix = substr($packed, 0, 6);
            $trimmed = (inet_ntop($prefix) ?: '::') . ':0/48';
            return $trimmed;
        }
    }
    return '0.0.0.0';
}

function hash_ip(string $ip, string $salt): string
{
    return substr(hash('sha256', $salt . '|' . $ip), 0, 32);
}

/**
 * Clasificacion del dispositivo a partir del User-Agent.
 * mobile / tablet / desktop / bot
 */
function detect_device(string $ua): string
{
    $ua = strtolower($ua);
    if ($ua === '' || preg_match('/bot|crawler|spider|curl|wget|httpclient|preview|facebookexternalhit|whatsapp|telegram|slack|discordbot|twitterbot|linkedinbot/i', $ua)) {
        return 'bot';
    }
    if (preg_match('/ipad|tablet|playbook|silk|(android(?!.*mobile))/i', $ua)) {
        return 'tablet';
    }
    if (preg_match('/mobile|iphone|ipod|android|blackberry|iemobile|opera mini|windows phone/i', $ua)) {
        return 'mobile';
    }
    return 'desktop';
}

function truncate(string $value, int $max): string
{
    if (function_exists('mb_substr') && mb_strlen($value, 'UTF-8') > $max) {
        return mb_substr($value, 0, $max, 'UTF-8');
    }
    if (strlen($value) > $max) {
        return substr($value, 0, $max);
    }
    return $value;
}

/** Registro local en JSONL (una linea por escaneo). */
function append_jsonl(string $path, array $record): bool
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

/** Postgres opcional. Devuelve true si el registro quedo persistido en BD. */
function append_pg(array $config, array $record): bool
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
            'CREATE TABLE IF NOT EXISTS card_scans (
                id           BIGSERIAL PRIMARY KEY,
                founder_id   TEXT NOT NULL,
                scanned_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                ip_address   TEXT,
                ip_hash      TEXT,
                user_agent   TEXT,
                referer      TEXT,
                device_type  TEXT,
                source       TEXT
            )'
        );
        $stmt = $pdo->prepare(
            'INSERT INTO card_scans
                (founder_id, scanned_at, ip_address, ip_hash, user_agent, referer, device_type, source)
             VALUES (:founder_id, :scanned_at, :ip_address, :ip_hash, :user_agent, :referer, :device_type, :source)'
        );
        $stmt->execute([
            ':founder_id'  => $record['founder_id'],
            ':scanned_at'  => $record['timestamp'],
            ':ip_address'  => $record['ip_address'],
            ':ip_hash'     => $record['ip_hash'],
            ':user_agent'  => $record['user_agent'],
            ':referer'     => $record['referer'],
            ':device_type' => $record['device_type'],
            ':source'      => $record['source'],
        ]);
        return true;
    } catch (Throwable $e) {
        error_log('[scan.php] Postgres no disponible: ' . $e->getMessage());
        return false;
    }
}

/** Agregado servido desde el JSONL local (no requiere BD). */
function stats_from_jsonl(string $path, string $founder): array
{
    $out = ['founder' => $founder, 'total' => 0, 'unique' => 0, 'by_device' => [], 'by_source' => [], 'by_day' => []];
    if (!is_file($path)) {
        return $out;
    }
    $fh = @fopen($path, 'rb');
    if ($fh === false) {
        return $out;
    }
    $hashes = [];
    while (($line = fgets($fh)) !== false) {
        $line = trim($line);
        if ($line === '') {
            continue;
        }
        $rec = json_decode($line, true);
        if (!is_array($rec) || ($rec['founder_id'] ?? '') !== $founder) {
            continue;
        }
        $out['total']++;
        if (!empty($rec['ip_hash'])) {
            $hashes[$rec['ip_hash']] = true;
        }
        $device = (string) ($rec['device_type'] ?? 'desktop');
        $out['by_device'][$device] = ($out['by_device'][$device] ?? 0) + 1;
        $source = (string) ($rec['source'] ?? 'qr');
        $out['by_source'][$source] = ($out['by_source'][$source] ?? 0) + 1;
        $day = substr((string) ($rec['timestamp'] ?? ''), 0, 10);
        if ($day !== '') {
            $out['by_day'][$day] = ($out['by_day'][$day] ?? 0) + 1;
        }
    }
    fclose($fh);
    $out['unique'] = count($hashes);
    ksort($out['by_day']);
    return $out;
}

/* ------------------------------------------------------------------ */

$founderId = isset($_GET['founder']) ? strtolower(trim((string) $_GET['founder'])) : '';
if ($founderId === '' && isset($_SERVER['PATH_INFO'])) {
    $founderId = strtolower(trim((string) $_SERVER['PATH_INFO'], '/'));
}
if (!isset(SCAN_FONDERS[$founderId])) {
    respond([
        'ok'      => false,
        'error'   => 'founder_id invalido',
        'validos' => array_keys(SCAN_FONDERS),
    ], 400);
}

$config = load_config();
$founder = SCAN_FONDERS[$founderId];

if (($_GET['stats'] ?? '') !== '' || (($_GET['action'] ?? '') === 'stats')) {
    respond([
        'ok'   => true,
        'stats' => stats_from_jsonl((string) $config['log_path'], $founderId),
    ], 200);
}

$ip       = client_ip();
$ua       = truncate((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 400);
$referer  = truncate((string) ($_SERVER['HTTP_REFERER'] ?? ''), 500);
$device   = detect_device($ua);
$source   = truncate((string) ($_GET['src'] ?? ''), 20) ?: 'qr';

$record = [
    'founder_id'  => $founderId,
    'timestamp'   => gmdate('c'),                 // ISO 8601 (UTC)
    'ip_address'  => $config['anonymize_ip'] ? mask_ip($ip) : $ip,
    'ip_hash'     => hash_ip($ip, (string) $config['salt']),
    'user_agent'  => $ua,
    'referer'     => $referer,
    'device_type' => $device,
    'source'      => $source,
];

$stored = append_pg($config, $record);
if (!$stored) {
    $stored = append_jsonl((string) $config['log_path'], $record);
}

$base = rtrim((string) $config['public_base'], '/');
$target = $base . '/' . $founder['slug'];

http_response_code(302);
header('Location: ' . $target);
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Scan-Recorded: ' . ($stored ? '1' : '0'));
exit;
