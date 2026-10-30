<?php
/**
 * Endpoint de contacto — equivalente en PHP de la Pages Function original
 * (.archive-cloudflare/functions/api/contact.ts, retirada el 2026-10-30).
 * Destinado a hosting compartido (Apache/cPanel + PHP), donde las Pages
 * Functions de Cloudflare no se ejecutan.
 */

declare(strict_types=1);

mb_internal_encoding('UTF-8');

const MAX_BODY_BYTES = 32768;
const MAX_TEXT_LEN   = 5000;

/**
 * El config vive fuera del webroot en producción. XLERION_CONTACT_CONFIG
 * permite apuntar a una ruta absoluta sin tocar código.
 */
function load_config(): array
{
    $candidates = [];
    $fromEnv = getenv('XLERION_CONTACT_CONFIG');
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

    // Las variables de entorno ganan si el host las expone (SetEnv / PutEnv).
    $envMap = [
        'RESEND_API_KEY' => 'resend_key',
        'EMAIL_FROM'     => 'email_from',
        'EMAIL_TO'       => 'email_to',
    ];
    foreach ($envMap as $env => $key) {
        $value = getenv($env);
        if (is_string($value) && $value !== '') {
            $config[$key] = $value;
        }
    }

    return $config + [
        'resend_key'   => '',
        'email_from'   => '',
        'email_to'     => '',
        'log_path'     => __DIR__ . '/logs/contact.log',
        'rate_store'   => __DIR__ . '/logs/.ratelimit',
        'rate_max'     => 5,
        'rate_window'  => 600,
    ];
}

function respond(array $payload, int $status): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Vuelca el registro en el log local. Nunca contiene credenciales.
 */
function write_log(array $config, string $line): void
{
    $path = $config['log_path'];
    $dir = dirname($path);
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    $stamp = date('Y-m-d H:i:s');
    @file_put_contents($path, "[{$stamp}] {$line}" . PHP_EOL, FILE_APPEND | LOCK_EX);
}

/**
 * Limitador por IP en fichero. Suficiente para un sitio corporativo y
 * sin depender de Redis/DB que el hosting compartido no siempre da.
 */
function rate_limit_allowed(array $config, string $ip): bool
{
    $store = $config['rate_store'];
    $dir = dirname($store);
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }

    $now = time();
    $entries = [];
    if (is_file($store) && is_readable($store)) {
        foreach (@file($store, FILE_IGNORE_NEW_LINES) ?: [] as $row) {
            $parts = explode('|', $row, 2);
            if (count($parts) === 2 && ($now - (int) $parts[1]) < $config['rate_window']) {
                $entries[$parts[0]][] = (int) $parts[1];
            }
        }
    }

    $hits = isset($entries[$ip]) ? count($entries[$ip]) : 0;
    $allowed = $hits < (int) $config['rate_max'];

    $entries[$ip][] = $now;
    $lines = [];
    foreach ($entries as $entryIp => $times) {
        foreach ($times as $time) {
            $lines[] = $entryIp . '|' . $time;
        }
    }
    @file_put_contents($store, implode(PHP_EOL, $lines) . PHP_EOL, LOCK_EX);

    return $allowed;
}

function client_ip(): string
{
    // X-Forwarded-For lo controla el cliente; REMOTE_ADDR es lo fiable.
    return isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : 'unknown';
}

/**
 * Devuelve el texto recortado y sin caracteres de control. Se aplica antes
 * de cualquier interpolación en headers o HTML.
 */
function clean_text($value, int $maxLen): string
{
    if (!is_string($value)) {
        return '';
    }
    $value = trim($value);
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);
    if (function_exists('mb_substr') && mb_strlen($value, 'UTF-8') > $maxLen) {
        $value = mb_substr($value, 0, $maxLen, 'UTF-8');
    } elseif (strlen($value) > $maxLen) {
        $value = substr($value, 0, $maxLen);
    }
    return $value;
}

/**
 * Sin saltos de línea: evita inyección de headers cuando el valor acaba en
 * la cabecera Subject de mail().
 */
function single_line(string $value): string
{
    return str_replace(["\r", "\n"], '', $value);
}

function valid_email(string $email): bool
{
    return $email !== ''
        && strlen($email) <= 254
        && filter_var($email, FILTER_VALIDATE_EMAIL) !== false
        && strpos($email, "\r") === false
        && strpos($email, "\n") === false;
}

/**
 * HTML del correo. Todo campo del usuario pasa por htmlspecialchars,
 * incluido el que se envía a Resend: es contenido no confiable.
 */
function build_email_html(array $d, string $ticketId): string
{
    $e = function (string $value): string {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    };

    $rows = [
        'Ticket'  => $ticketId,
        'Nombre'  => $d['name'],
        'Empresa' => $d['company'] !== '' ? $d['company'] : 'No especificada',
        'Email'   => $d['email'],
        'Cargo'   => $d['role'] !== '' ? $d['role'] : 'No especificado',
        'Sector'  => $d['sector'],
        'Interés' => $d['interest'],
    ];

    $html = '<h2>Nueva solicitud de Prueba de Concepto</h2>';
    foreach ($rows as $label => $value) {
        if ($value === '') {
            continue;
        }
        $html .= '<p><strong>' . $e($label) . ':</strong> ' . $e($value) . '</p>';
    }
    $html .= '<p><strong>Mensaje / Desafío:</strong></p><p>'
        . nl2br($e($d['message'])) . '</p>';

    return $html;
}

function send_via_resend(array $config, string $subject, string $html, string $replyTo): array
{
    if (!function_exists('curl_init')) {
        return [false, 'cURL no está disponible en el servidor'];
    }

    $payload = [
        'from'      => $config['email_from'],
        'to'        => [$config['email_to']],
        'subject'   => $subject,
        'html'      => $html,
        'reply_to'  => $replyTo,
    ];

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $config['resend_key'],
            'Content-Type: application/json',
        ],
    ]);
    $body = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($body === false) {
        return [false, 'Error de red: ' . $curlError];
    }
    if ($status < 200 || $status >= 300) {
        return [false, 'Resend HTTP ' . $status . ': ' . substr((string) $body, 0, 300)];
    }
    return [true, 'Resend OK'];
}

/**
 * Ruta por defecto en cPanel: el SMTP local del host. Config::email_to es
 * una dirección fija y controlada, y el From se fuerza al dominio propio
 * para no acabar en listas de spam.
 */
function send_via_mail(array $config, string $subject, string $html, string $replyTo): array
{
    $fromHost = parse_url($config['email_from'], PHP_URL_HOST);
    $from = is_string($fromHost) && $fromHost !== ''
        ? 'no-reply@' . $fromHost
        : $config['email_to'];

    $headers = [
        'From: ' . $from,
        'Reply-To: ' . $replyTo,
        'Content-Type: text/html; charset=UTF-8',
        'X-Mailer: Xlerion-ContactForm',
    ];

    $sent = @mail($config['email_to'], single_line($subject), $html, implode(PHP_EOL, $headers));
    return [$sent, $sent ? 'mail() OK' : 'mail() devolvió false (revisa el SMTP del hosting)'];
}

// --------------------------------------------------------------------------

$config = load_config();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(['success' => false, 'error' => 'Método no permitido'], 405);
}

$raw = file_get_contents('php://input');
if (!is_string($raw) || $raw === '') {
    respond(['success' => false, 'error' => 'Faltan campos requeridos'], 400);
}
if (strlen($raw) > MAX_BODY_BYTES) {
    respond(['success' => false, 'error' => 'Solicitud demasiado grande'], 413);
}

$decoded = json_decode($raw, true);
if (!is_array($decoded)) {
    respond(['success' => false, 'error' => 'Faltan campos requeridos'], 400);
}

// Los dos formularios del sitio envían formas distintas:
//   ContactPoCSection -> name, company, email, role, sector, interest, challenge, consent
//   ContactForm       -> name, email, message   (sin consentimiento)
$isPoc = isset($decoded['challenge']) && trim((string) $decoded['challenge']) !== '';

$data = [
    'name'    => clean_text($decoded['name'] ?? '', 160),
    'company' => clean_text($decoded['company'] ?? '', 160),
    'email'   => clean_text($decoded['email'] ?? '', 254),
    'role'    => clean_text($decoded['role'] ?? '', 120),
    'sector'  => clean_text($decoded['sector'] ?? '', 120),
    'interest'=> clean_text($decoded['interest'] ?? '', 120),
    'message' => $isPoc
        ? clean_text($decoded['challenge'] ?? '', MAX_TEXT_LEN)
        : clean_text($decoded['message'] ?? '', MAX_TEXT_LEN),
];

$consent = !empty($decoded['consent']);

if ($data['name'] === '' || $data['email'] === '' || $data['message'] === '') {
    respond(['success' => false, 'error' => 'Faltan campos requeridos'], 400);
}
if ($isPoc && ($data['company'] === '' || !$consent)) {
    respond(['success' => false, 'error' => 'Faltan campos requeridos'], 400);
}
if (!valid_email($data['email'])) {
    respond(['success' => false, 'error' => 'Correo electrónico inválido'], 400);
}

$ip = client_ip();
if (!rate_limit_allowed($config, $ip)) {
    write_log($config, "RATE_LIMIT bloqueado ip={$ip}");
    respond(['success' => false, 'error' => 'Demasiadas solicitudes, intente más tarde'], 429);
}

$ticketId = 'POC-XLERION-' . random_int(1000, 9999);
$subject  = single_line('Nueva solicitud PoC: ' . $ticketId . ' - ' . $data['company']);
$html     = build_email_html($data, $ticketId);

$logLine = implode(' | ', [
    'Ticket: ' . $ticketId,
    'IP: ' . $ip,
    'Nombre: ' . $data['name'],
    'Empresa: ' . $data['company'],
    'Email: ' . $data['email'],
    'Cargo: ' . $data['role'],
    'Sector: ' . $data['sector'],
    'Interes: ' . $data['interest'],
    'Mensaje: ' . str_replace(["\r", "\n"], ' ', $data['message']),
]);
write_log($config, $logLine);

// El envío por correo es secundario: si falla, la solicitud quedó registrada
// y la respuesta sigue siendo success, igual que en la versión de Workers.
if ($config['email_to'] !== '') {
    if ($config['resend_key'] !== '' && $config['email_from'] !== '') {
        list($ok, $detail) = send_via_resend($config, $subject, $html, $data['email']);
    } else {
        list($ok, $detail) = send_via_mail($config, $subject, $html, $data['email']);
    }
    if (!$ok) {
        write_log($config, "EMAIL FALLIDO {$ticketId}: {$detail}");
    } else {
        write_log($config, "EMAIL ENVIADO {$ticketId}: {$detail}");
    }
} else {
    write_log($config, "SIN CONFIGURAR email_to {$ticketId}: solo se registró en el log");
}

respond([
    'success'  => true,
    'ticketId' => $ticketId,
    'message'  => 'Solicitud registrada. Le contactaremos en < 24h hábiles.',
], 200);
