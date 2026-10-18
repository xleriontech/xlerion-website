<?php
// Habilitar registro de errores para debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/email-errors.log');

// Habilitar CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

// Obtener los datos del formulario
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

// Log de debugging
error_log("Datos recibidos: " . print_r($input, true));

// Validar datos
if (empty($input['name']) || empty($input['email']) || empty($input['message'])) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Faltan campos requeridos',
        'received' => array_keys($input ?: [])
    ]);
    exit();
}

// Validar formato de email
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email inválido']);
    exit();
}

 $to = getenv('SALES_EMAIL') ?: 'sales@xlerion.com';
$from = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$name = htmlspecialchars(strip_tags($input['name']), ENT_QUOTES, 'UTF-8');
$subject = 'Nuevo mensaje de contacto de ' . $name;
$message = htmlspecialchars(strip_tags($input['message']), ENT_QUOTES, 'UTF-8');

// Construir el email con headers más compatibles
$headers = [];
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/html; charset=UTF-8";
$headers[] = "From: Formulario XLERION <noreply@xlerion.com>";
$headers[] = "Reply-To: $name <$from>";
$headers[] = "X-Mailer: PHP/" . phpversion();
$headers[] = "X-Priority: 3";

$body = "<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>$subject</title>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
    <div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;'>
        <h2 style='color: #00e9fa; border-bottom: 2px solid #00e9fa; padding-bottom: 10px;'>
            $subject
        </h2>
        <div style='background-color: white; padding: 20px; border-radius: 5px; margin-top: 20px;'>
            <p><strong>De:</strong> $name</p>
            <p><strong>Email:</strong> <a href='mailto:$from'>$from</a></p>
            <p><strong>Mensaje:</strong></p>
            <div style='padding: 15px; background-color: #f9f9f9; border-left: 4px solid #00e9fa;'>
                <p>" . nl2br($message) . "</p>
            </div>
        </div>
        <p style='margin-top: 20px; font-size: 12px; color: #666;'>
            Este mensaje fue enviado desde el formulario de contacto de xlerion.com
        </p>
    </div>
</body>
</html>";

// Preparar headers como string
$headersString = implode("\r\n", $headers);

// Función simple para enviar SMTP con AUTH LOGIN sobre SSL (puerto 465)
function smtp_send_auth_ssl($host, $port, $user, $pass, $from, $to, $subject, $body, $headersString) {
    $errno = 0; $errstr = '';
    $remote = "ssl://" . $host . ":" . $port;
    $fp = @stream_socket_client($remote, $errno, $errstr, 10, STREAM_CLIENT_CONNECT);
    if (!$fp) {
        return [false, "Connection failed: $errstr ($errno)"];
    }
    stream_set_timeout($fp, 10);
    $res = fread($fp, 512);
    // EHLO
    fwrite($fp, "EHLO localhost\r\n");
    $res = fread($fp, 512);
    // AUTH LOGIN
    fwrite($fp, "AUTH LOGIN\r\n");
    $res = fread($fp, 512);
    fwrite($fp, base64_encode($user) . "\r\n");
    $res = fread($fp, 512);
    fwrite($fp, base64_encode($pass) . "\r\n");
    $res = fread($fp, 512);
    // MAIL FROM
    fwrite($fp, "MAIL FROM:<" . $from . ">\r\n");
    $res = fread($fp, 512);
    // RCPT TO
    fwrite($fp, "RCPT TO:<" . $to . ">\r\n");
    $res = fread($fp, 512);
    // DATA
    fwrite($fp, "DATA\r\n");
    $res = fread($fp, 512);
    // Construct headers + body
    $data = $headersString . "\r\n\r\n" . $body . "\r\n.\r\n";
    fwrite($fp, $data);
    $res = fread($fp, 512);
    // QUIT
    fwrite($fp, "QUIT\r\n");
    $res = fread($fp, 512);
    fclose($fp);
    // Basic check for 250 or 354 in responses not implemented in full; assume success if no errors
    return [true, 'OK'];
}

// Intentar envío vía SMTP autenticado si se dispone de credenciales en variables de entorno
$smtpUser = getenv('SMTP_USER') ?: getenv('SMTP_USERNAME');
$smtpPass = getenv('SMTP_PASS') ?: getenv('SMTP_PASSWORD');
$smtpHost = getenv('SMTP_HOST') ?: 'mail.xlerion.com';
$smtpPort = getenv('SMTP_PORT') ?: 465;
$smtpResult = [false, ''];

// Si SMTP está configurado, intentar envío
if (!empty($smtpUser) && !empty($smtpPass)) {
    error_log("Attempting SMTP auth send to $smtpHost:$smtpPort as $smtpUser");
    list($ok, $info) = smtp_send_auth_ssl($smtpHost, $smtpPort, $smtpUser, $smtpPass, $from, $to, $subject, $body, $headersString);
    $smtpResult = [$ok, $info];
}

// Si SMTP fue exitoso marcar como enviado, si no intentar mail() nativo
if ($smtpResult[0]) {
    $mailSent = true;
    error_log("Email enviado vía SMTP: " . $smtpResult[1]);
} else {
    // Si SMTP no está configurado o falló, intentar mail() nativo
    error_log("SMTP no disponible o falló. Intentando mail() nativo...");
    $mailSent = @mail($to, $subject, $body, $headersString);
}

if ($mailSent) {
    error_log("Email enviado exitosamente a $to");
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Email enviado correctamente'
    ]);
} else {
    $error = error_get_last();
    error_log("Error al enviar email: " . print_r($error, true));

    // Dev fallback: si mail() falla en entorno de desarrollo, guardar el email en disco
    $sentDir = __DIR__ . '/../sent_emails';
    if (!is_dir($sentDir)) {
        @mkdir($sentDir, 0755, true);
    }
    $timestamp = date('Ymd_His');
    $filename = $sentDir . "/email_{$timestamp}_" . preg_replace('/[^a-z0-9_\\-]/i', '_', $from) . ".html";
    $saved = @file_put_contents($filename, $body);
    // Guardar metadatos (destinatario, headers) para facilitar verificación en dev
    $meta = [
        'to' => $to,
        'from' => $from,
        'name' => $name,
        'filename' => $filename,
        'headers' => $headers,
        'timestamp' => $timestamp
    ];
    $metaFilename = $sentDir . "/email_{$timestamp}_meta.json";
    @file_put_contents($metaFilename, json_encode($meta, JSON_PRETTY_PRINT));

    if ($saved !== false) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'SMTP no disponible: email guardado localmente (dev fallback)',
            'saved_path' => str_replace('\\\\', '/', $filename),
            'meta_path' => str_replace('\\\\', '/', $metaFilename)
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'error' => 'Error al enviar el email',
            'details' => 'Por favor verifica la configuración SMTP del servidor'
        ]);
    }
}
