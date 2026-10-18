<?php
// Test directo para verificar headers CORS

// Enviar headers CORS inmediatamente
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');

// Log de diagnóstico
$log = [
    'timestamp' => date('Y-m-d H:i:s'),
    'request_method' => $_SERVER['REQUEST_METHOD'],
    'request_uri' => $_SERVER['REQUEST_URI'],
    'headers_sent' => function_exists('headers_sent') ? headers_sent() : false,
    'php_sapi' => php_sapi_name(),
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
];

// Responder a OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    $log['response'] = 'OPTIONS preflight handled';
    die(json_encode($log));
}

// GET request para diagnóstico
$log['response'] = 'Headers enviados correctamente';
http_response_code(200);
echo json_encode($log);
?>
