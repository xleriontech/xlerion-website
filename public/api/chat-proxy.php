<?php
/**
 * Proxy del Asistente Xlerion.
 *
 * El hosting compartido (cPanel/CloudLinux) no puede ejecutar inferencia ni
 * bases vectoriales: la RAM y el swap estan al limite. Este script solo
 * valida, limita y audita; la recuperacion y la generacion viven en un
 * gateway externo (Cloudflare Worker / Vercel Function) al que se llama con
 * un token propio.
 *
 * Contrato del gateway (POST, JSON):
 *   entrada: { "messages": [ { "role": "system|user|assistant", "content": "..." } ] }
 *   salida:  { "answer": "...", "confidence": 0.0-1.0,
 *              "sources": [ { "title": "...", "url": "https://..." } ],
 *              "refused": false }
 *
 * La configuracion vive fuera de public_html:
 *   /home/USUARIO/xlerion-secrets/ai.php        (credenciales, modo 600)
 *   /home/USUARIO/xlerion-secrets/ai.php.prompt (system prompt)
 */
declare(strict_types=1);

const CONSENT_VERSION = '2026-11';
const MAX_BODY        = 8192;
const MAX_QUESTION    = 500;
const RATE_LIMIT      = 8;
const RATE_WINDOW     = 60;
const TIMEOUT         = 25;
const MIN_CONFIDENCE  = 0.75;

const REFUSAL_TEXT = 'No cuento con información verificable sobre ese tema en las fuentes oficiales de Xlerion. Para brindarte una respuesta precisa, te recomiendo contactar directamente a nuestro equipo en contacto@xlerion.com.co o al WhatsApp +57 313 226 3265.';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function config_path(): string
{
    $fromEnv = getenv('XLERION_AI_CONFIG');
    if (is_string($fromEnv) && $fromEnv !== '') {
        return $fromEnv;
    }
    return dirname(__DIR__, 2) . '/xlerion-secrets/ai.php';
}

function load_config(string $path): ?array
{
    if (!is_file($path)) {
        return null;
    }
    try {
        $data = require $path;
    } catch (Throwable $e) {
        return null;
    }
    return is_array($data) ? $data : null;
}

function provider_of(array $config): string
{
    $provider = (string)($config['provider'] ?? 'gateway');
    return in_array($provider, ['gateway', 'groq'], true) ? $provider : '';
}

function proxy_enabled(?array $config, string $path): bool
{
    if ($config === null || ($config['enabled'] ?? false) !== true) {
        return false;
    }
    foreach (['db_dsn', 'db_user', 'db_pass', 'ip_pepper'] as $key) {
        if (!isset($config[$key]) || !is_string($config[$key]) || $config[$key] === '') {
            return false;
        }
    }
    if (!is_file($path . '.prompt')) {
        return false;
    }

    $provider = provider_of($config);
    if ($provider === 'gateway') {
        return isset($config['gateway'], $config['token'])
            && is_string($config['gateway']) && $config['gateway'] !== ''
            && is_string($config['token']) && $config['token'] !== '';
    }
    if ($provider === 'groq') {
        return isset($config['groq_api_key'], $config['groq_model'])
            && is_string($config['groq_api_key']) && $config['groq_api_key'] !== ''
            && is_string($config['groq_model']) && $config['groq_model'] !== '';
    }
    return false;
}

function allowed_origins(array $config): array
{
    $defaults = [
        'https://xlerion.com.co',
        'https://www.xlerion.com.co',
        'http://localhost:5173',
        'http://localhost:4173',
    ];
    if (isset($config['allowed_origins']) && is_array($config['allowed_origins'])) {
        return array_values(array_unique(array_merge($defaults, $config['allowed_origins'])));
    }
    return $defaults;
}

function check_origin(array $config): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') {
        return; // same-origin sin cabecera Origin (GET simples)
    }
    if (!in_array($origin, allowed_origins($config), true)) {
        respond(403, ['error' => 'origin']);
    }
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

function db(array $config): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO($config['db_dsn'], $config['db_user'], $config['db_pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
    return $pdo;
}

function text_hash(string $value, string $pepper): string
{
    return hash_hmac('sha256', $value, $pepper);
}

function clean_text(string $value, int $limit): string
{
    $value = preg_replace('/[\x00-\x1F\x7F]/u', '', $value) ?? '';
    return mb_substr(trim($value), 0, $limit);
}

function allowed_source(string $url): bool
{
    return (bool)preg_match('#^https://(www\.)?(xlerion\.com\.co|mintic\.gov\.co)/#i', $url);
}

function has_forbidden_claim(string $answer): bool
{
    $lower = mb_strtolower($answer);
    $forbidden = [
        'premiada', 'beneficiaria', 'avalada', 'respaldada', 'ganadora',
        'seleccionada por el mintic', 'certificada por el mintic',
        'reconocida oficialmente', 'avalada por el mintic',
        'respaldada por el mintic',
    ];
    foreach ($forbidden as $term) {
        if (strpos($lower, $term) !== false) {
            return true;
        }
    }
    return false;
}

$configPath = config_path();
$config = load_config($configPath);
$enabled = proxy_enabled($config, $configPath);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

/* ---- Health check: el widget solo aparece si esto responde enabled ---- */
if ($method === 'GET') {
    if (isset($_GET['health'])) {
        respond(200, ['enabled' => $enabled]);
    }
    respond(405, ['error' => 'method']);
}

if ($method === 'OPTIONS') {
    if ($config !== null) {
        check_origin($config);
    }
    header('Allow: GET, POST, OPTIONS');
    http_response_code(204);
    exit;
}

if ($method !== 'POST') {
    respond(405, ['error' => 'method']);
}

if (!$enabled || $config === null) {
    respond(503, ['error' => 'disabled']);
}

check_origin($config);

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > MAX_BODY) {
    respond(413, ['error' => 'body']);
}

$input = json_decode($raw, true);
if (!is_array($input)) {
    respond(400, ['error' => 'json']);
}

$question = clean_text((string)($input['question'] ?? ''), MAX_QUESTION);
$consent = ($input['consent'] ?? false) === true;
$consentVersion = (string)($input['consent_version'] ?? '');

if (!$consent || $consentVersion !== CONSENT_VERSION) {
    respond(422, ['error' => 'consent_required']);
}
if ($question === '') {
    respond(422, ['error' => 'question']);
}

$history = [];
if (isset($input['history']) && is_array($input['history'])) {
    foreach (array_slice($input['history'], -6) as $turn) {
        $role = (string)($turn['role'] ?? '');
        $content = clean_text((string)($turn['content'] ?? ''), 800);
        if (in_array($role, ['user', 'assistant'], true) && $content !== '') {
            $history[] = ['role' => $role, 'content' => $content];
        }
    }
}

/* ---- Rate limit por IP (hash con pepper, sin guardar la IP) ---- */
$pepper = $config['ip_pepper'];
$ipHash = text_hash($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0', $pepper);

try {
    $pdo = db($config);
    $pdo->prepare(
        'INSERT INTO chat_rate (ip_hash, window_start, hits) VALUES (?, NOW(), 1)
         ON DUPLICATE KEY UPDATE
            hits = IF(window_start < NOW() - INTERVAL ' . RATE_WINDOW . ' SECOND, 1, hits + 1),
            window_start = IF(window_start < NOW() - INTERVAL ' . RATE_WINDOW . ' SECOND, NOW(), window_start)'
    )->execute([$ipHash]);

    $stmt = $pdo->prepare('SELECT hits FROM chat_rate WHERE ip_hash = ?');
    $stmt->execute([$ipHash]);
    if ((int)$stmt->fetchColumn() > RATE_LIMIT) {
        respond(429, ['error' => 'rate_limit']);
    }
} catch (Throwable $e) {
    respond(503, ['error' => 'database']);
}

$promptPath = $configPath . '.prompt';
$systemPrompt = is_file($promptPath) ? trim((string)file_get_contents($promptPath)) : '';
if ($systemPrompt === '') {
    respond(503, ['error' => 'prompt']);
}

$messages = [['role' => 'system', 'content' => $systemPrompt]];
foreach ($history as $turn) {
    $messages[] = $turn;
}
$messages[] = ['role' => 'user', 'content' => $question];

/* ---- Proveedor: gateway propio o Groq directo ---- */
$provider = provider_of($config);

if ($provider === 'groq') {
    $endpoint = (string)($config['groq_endpoint'] ?? 'https://api.groq.com/openai/v1/chat/completions');
    $payload = [
        'model' => $config['groq_model'],
        'messages' => $messages,
        'temperature' => 0.2,
        'max_tokens' => 1800,
    ];
    if (($config['groq_json_mode'] ?? true) === true) {
        $payload['response_format'] = ['type' => 'json_object'];
    }
    $headers = [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $config['groq_api_key'],
        'User-Agent: XlerionAssistantProxy/1.0',
    ];
} else {
    $endpoint = $config['gateway'];
    $payload = ['messages' => $messages];
    $headers = [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $config['token'],
        'User-Agent: XlerionAssistantProxy/1.0',
    ];
}

$startedAt = microtime(true);
$curl = curl_init($endpoint);
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => TIMEOUT,
    CURLOPT_CONNECTTIMEOUT => 8,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
]);
$body = curl_exec($curl);
$status = (int)curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
curl_close($curl);

$latencyMs = (int)round((microtime(true) - $startedAt) * 1000);

if ($body === false || $status !== 200) {
    respond($status === 429 ? 503 : 502, ['error' => 'gateway']);
}

$data = json_decode((string)$body, true);
if (!is_array($data)) {
    respond(502, ['error' => 'gateway']);
}

/* Groq responde en formato OpenAI: el prompt pide JSON dentro del mensaje. */
if ($provider === 'groq') {
    $content = $data['choices'][0]['message']['content'] ?? '';
    $parsed = is_string($content) ? json_decode($content, true) : null;
    if (is_array($parsed)) {
        $data = $parsed;
        // Sin retrieval no hay fuentes verificables: no se muestran citas.
        $data['sources'] = [];
    } else {
        $data = [
            'answer' => is_string($content) ? $content : '',
            'confidence' => 0.8,
            'sources' => [],
            'refused' => false,
        ];
    }
}

$answer = clean_text((string)($data['answer'] ?? ''), 2000);
$confidence = isset($data['confidence']) ? max(0.0, min(1.0, (float)$data['confidence'])) : 0.0;
$refused = ($data['refused'] ?? false) === true || $confidence < MIN_CONFIDENCE || $answer === '';

$sources = [];
if (isset($data['sources']) && is_array($data['sources'])) {
    foreach (array_slice($data['sources'], 0, 5) as $source) {
        $url = (string)($source['url'] ?? '');
        if (!allowed_source($url)) {
            continue;
        }
        $title = clean_text((string)($source['title'] ?? $url), 120);
        $sources[] = ['title' => $title !== '' ? $title : $url, 'url' => $url];
    }
}

/* ---- Guardarrail etico: segunda linea de defensa ---- */
if ($refused || has_forbidden_claim($answer)) {
    $answer = REFUSAL_TEXT;
    $sources = [];
    $refused = true;
}

/* ---- Auditoria: solo hashes, nunca el texto ni la IP ---- */
try {
    $pdo->prepare(
        'INSERT INTO chat_audit
            (question_hash, answer_hash, ip_hash, confidence, sources_count, refused, consent_version, latency_ms)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )->execute([
        text_hash($question, $pepper),
        text_hash($answer, $pepper),
        $ipHash,
        $confidence,
        count($sources),
        $refused ? 1 : 0,
        CONSENT_VERSION,
        $latencyMs,
    ]);
} catch (Throwable $e) {
    /* un fallo de auditoria no debe romper la respuesta */
}

respond(200, [
    'answer' => $answer,
    'confidence' => round($confidence, 3),
    'sources' => $sources,
    'refused' => $refused,
]);
