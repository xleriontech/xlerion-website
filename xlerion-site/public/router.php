<?php
/**
 * Router PHP simplificado para Total Darkness
 * Maneja CORS y routing básico
 */

// ===== CORS HEADERS (PRIMERO) =====
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
header('Access-Control-Max-Age: 86400');

// Nota: No forzar Content-Type por defecto; se establecerá según la respuesta.

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Incluir el archivo correcto
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Root y SPA fallbacks
if ($uri === '/' || $uri === '') {
    $indexFile = __DIR__ . '/index.html';
    if (file_exists($indexFile)) {
        header('Content-Type: text/html');
        readfile($indexFile);
        exit;
    }
}

// Redemthor: servir index.html al acceder a la raíz de la carpeta
if (preg_match('#^/redemthor/?$#', $uri)) {
    $redemthorIndex = __DIR__ . '/redemthor/index.html';
    if (file_exists($redemthorIndex)) {
        header('Content-Type: text/html');
        readfile($redemthorIndex);
        exit;
    }
}

// Total Darkness: servir dashboard por defecto
if (preg_match('#^/total-darkness/?$#', $uri)) {
    $tdDashboard = __DIR__ . '/total-darkness/dashboard.html';
    if (file_exists($tdDashboard)) {
        header('Content-Type: text/html');
        readfile($tdDashboard);
        exit;
    }
}

// Mapeo de rutas
if (strpos($uri, '/api/send-email.php') === 0) {
    require __DIR__ . '/api/send-email.php';
    exit;
}

if (strpos($uri, '/api/analytics-visitor-count.php') === 0) {
    require __DIR__ . '/api/analytics-visitor-count.php';
    exit;
}

if (strpos($uri, '/api/analytics.php') === 0) {
    require __DIR__ . '/api/analytics.php';
    exit;
}

if (strpos($uri, '/api/analytics-ping.php') === 0) {
    require __DIR__ . '/api/analytics-ping.php';
    exit;
}

if (strpos($uri, '/api/analytics-event.php') === 0) {
    require __DIR__ . '/api/analytics-event.php';
    exit;
}

if (strpos($uri, '/api/analytics-admin-login.php') === 0) {
    require __DIR__ . '/api/analytics-admin-login.php';
    exit;
}

if (strpos($uri, '/api/analytics-admin-logout.php') === 0) {
    require __DIR__ . '/api/analytics-admin-logout.php';
    exit;
}

if (strpos($uri, '/api/analytics-admin-data.php') === 0) {
    require __DIR__ . '/api/analytics-admin-data.php';
    exit;
}

if (strpos($uri, '/api/analytics-dashboard.php') === 0) {
    require __DIR__ . '/api/analytics-dashboard.php';
    exit;
}

if (strpos($uri, '/api/roadmaps.php') === 0 || strpos($uri, '/api/roadmaps/') === 0) {
    require __DIR__ . '/api/roadmaps.php';
    exit;
}

if (strpos($uri, '/total-darkness/api/auth.php') === 0) {
    require __DIR__ . '/total-darkness/api/auth.php';
    exit;
}

if (strpos($uri, '/redemthor/api/contador.php') !== false) {
    require __DIR__ . '/redemthor/api/contador.php';
    exit;
}

if (strpos($uri, '/total-darkness/test-php-headers.php') === 0) {
    require __DIR__ . '/total-darkness/test-php-headers.php';
    exit;
}

// Servir archivos estáticos
// Decodificar URI para manejar espacios y caracteres codificados (%20)
$path = urldecode($uri);
$file = realpath(__DIR__ . $path);

// Asegurar que el archivo está dentro del directorio público
if ($file && strpos($file, realpath(__DIR__)) === 0 && file_exists($file) && is_file($file)) {
    // Determinar MIME type de forma robusta: finfo -> mime_content_type -> extensión
    $mimeType = 'application/octet-stream';

    if (function_exists('finfo_open')) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo) {
            $detected = finfo_file($finfo, $file);
            if ($detected) $mimeType = $detected;
            finfo_close($finfo);
        }
    } elseif (function_exists('mime_content_type')) {
        $detected = mime_content_type($file);
        if ($detected) $mimeType = $detected;
    } else {
        // Fallback por extensión
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        $map = [
            'html' => 'text/html', 'htm' => 'text/html',
            'css' => 'text/css', 'js' => 'application/javascript',
            'json' => 'application/json', 'png' => 'image/png',
            'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'gif' => 'image/gif',
            'svg' => 'image/svg+xml', 'ico' => 'image/x-icon',
            'woff' => 'font/woff', 'woff2' => 'font/woff2', 'ttf' => 'font/ttf',
            'pdf' => 'application/pdf', 'txt' => 'text/plain', 'map' => 'application/json'
        ];
        if (isset($map[$ext])) $mimeType = $map[$ext];
    }

    header('Content-Type: ' . $mimeType);
    readfile($file);
    exit;
}

// Si es directorio, servir index.html
if ($file && is_dir($file)) {
    $indexFile = $file . '/index.html';
    if (file_exists($indexFile)) {
        header('Content-Type: text/html');
        readfile($indexFile);
        exit;
    }
}

// 404
http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Not found', 'uri' => $uri]);
