<?php
// Mostrar IP pública
$ip = $_SERVER['REMOTE_ADDR'] ?? 'Desconocida';
echo json_encode([
    'your_public_ip' => $ip,
    'connection_from' => $_SERVER['HTTP_CLIENT_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $ip,
    'server_time' => date('Y-m-d H:i:s')
], JSON_PRETTY_PRINT);
?>
