<?php
/**
 * Router PHP para Total Darkness
 * Maneja CORS correctamente antes de servir archivos
 * 
 * Uso: php -S localhost:8080 router.php
 */

// ===== CORS HEADERS - DEBEN SER LO PRIMERO =====
header('Access-Control-Allow-Origin: *', true);
header('Access-Control-Allow-Credentials: true', true);
header('Access-Control-Max-Age: 86400', true);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD', true);
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin', true);
header('Content-Type: application/json; charset=UTF-8', true);

// Manejo de preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(json_encode(['status' => 'ok', 'message' => 'CORS preflight']));
}

// Obtener ruta solicitada
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Ruta del documento root
$documentRoot = __DIR__;

// Rutas especiales para PHP
$phpRoutes = [
    '/total-darkness/api/auth.php',
    '/total-darkness/test-php-headers.php',
];

// Si es una ruta PHP, servir directamente
foreach ($phpRoutes as $phpRoute) {
    if ($requestUri === $phpRoute) {
        $phpFile = $documentRoot . $phpRoute;
        if (file_exists($phpFile)) {
            require $phpFile;
            exit;
        }
    }
}

// Si es un archivo estático, servir
$filePath = $documentRoot . $requestUri;

// Prevenir directory traversal
if (strpos(realpath($filePath), realpath($documentRoot)) !== 0) {
    http_response_code(403);
    exit(json_encode(['error' => 'Forbidden']));
}

// Si el archivo existe, servir
if (file_exists($filePath)) {
    // Determinar content-type
    $ext = pathinfo($filePath, PATHINFO_EXTENSION);
    $mimeTypes = [
        'html' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
    ];
    
    if (isset($mimeTypes[$ext])) {
        header('Content-Type: ' . $mimeTypes[$ext], true);
    }
    
    readfile($filePath);
    exit;
}

// Si es un directorio, servir index.html
if (is_dir($filePath)) {
    $indexPath = $filePath . '/index.html';
    if (file_exists($indexPath)) {
        header('Content-Type: text/html', true);
        readfile($indexPath);
        exit;
    }
}

// No encontrado
http_response_code(404);
echo json_encode(['error' => 'Not found', 'path' => $requestUri]);
?>
