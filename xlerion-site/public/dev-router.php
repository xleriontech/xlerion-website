<?php
/**
 * Simple PHP Router for Development
 * Ejecuta archivos PHP y sirve archivos estáticos
 */

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestFile = __DIR__ . $requestUri;

// Si la ruta es un archivo que existe y es un archivo PHP
if (is_file($requestFile) && pathinfo($requestFile, PATHINFO_EXTENSION) === 'php') {
    require $requestFile;
    exit;
}

// Si es un directorio, intenta index.html o index.php
if (is_dir($requestFile) || $requestUri === '/') {
    $indexPhp = $requestFile . (substr($requestFile, -1) === '/' ? '' : '/') . 'index.php';
    $indexHtml = $requestFile . (substr($requestFile, -1) === '/' ? '' : '/') . 'index.html';
    
    if (file_exists($indexPhp)) {
        require $indexPhp;
        exit;
    }
    if (file_exists($indexHtml)) {
        readfile($indexHtml);
        exit;
    }
}

// Sirve archivos estáticos
if (is_file($requestFile)) {
    $mimeTypes = [
        'js' => 'application/javascript',
        'css' => 'text/css',
        'json' => 'application/json',
        'html' => 'text/html',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon',
    ];
    
    $ext = pathinfo($requestFile, PATHINFO_EXTENSION);
    $mimeType = $mimeTypes[$ext] ?? 'text/plain';
    
    header("Content-Type: $mimeType");
    readfile($requestFile);
    exit;
}

// No encontrado
http_response_code(404);
echo "404 - Not Found: $requestUri";
?>
