<?php
// API de Autenticación para Total Darkness
// Maneja login, recuperación de contraseña y gestión de administradores

// NOTA: Los headers CORS son manejados por el router.php
// Este archivo simplemente procesa la lógica de API

// Configuración JSON
header('Content-Type: application/json; charset=UTF-8');

// Enable error reporting for debugging
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Credenciales SMTP - Cargar desde variables de entorno
$smtp_host = getenv('SMTP_HOST') ?: 'mail.xlerion.com';
$smtp_port = getenv('SMTP_PORT') ?: 465;
$smtp_username = getenv('SMTP_USERNAME') ?: 'support@xlerion.com';
$smtp_password = getenv('SMTP_PASSWORD');

if (!$smtp_password) {
    error_log('WARNING: SMTP_PASSWORD no está configurada, email fallback enabled');
    // No retornar error 500, permitir que continúe con fallback a mail() nativo
    $smtp_password = '';
}

define('SMTP_HOST', $smtp_host);
define('SMTP_PORT', $smtp_port);
define('SMTP_USERNAME', $smtp_username);
define('SMTP_PASSWORD', $smtp_password);
define('SMTP_FROM_EMAIL', $smtp_username);
define('SMTP_FROM_NAME', 'Total Darkness - Soporte');

// Detectar URL base según el entorno
function getBaseUrl() {
    if ($_SERVER['HTTP_HOST'] === 'localhost:8080') {
        return 'http://localhost:5173'; // Desarrollo local
    }
    return 'https://xlerion.com'; // Producción
}

// Configuración de base de datos SQLite
$dbFile = __DIR__ . '/../data/admins.db';
$dbDir = dirname($dbFile);

// Crear directorio si no existe
if (!file_exists($dbDir)) {
    mkdir($dbDir, 0755, true);
}

// Conexión a la base de datos
try {
    $db = new PDO('sqlite:' . $dbFile);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Crear tabla de administradores si no existe
    $db->exec("
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_by TEXT,
            last_login DATETIME,
            active INTEGER DEFAULT 1
        )
    ");
    
    // Crear tabla de tokens de recuperación
    $db->exec("
        CREATE TABLE IF NOT EXISTS recovery_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            token TEXT UNIQUE NOT NULL,
            expires_at DATETIME NOT NULL,
            used INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    // Verificar si existe el admin por defecto
    $stmt = $db->query("SELECT COUNT(*) FROM admins");
    if ($stmt->fetchColumn() == 0) {
        // Crear admin por defecto: admin@xlerion.com / TotalDarkness2026!
        $defaultHash = hash('sha256', 'TotalDarkness2026!');
        $db->exec("
            INSERT INTO admins (email, password_hash, name, created_by)
            VALUES ('admin@xlerion.com', '$defaultHash', 'Administrador Principal', 'SYSTEM')
        ");
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    exit();
}

// Función para enviar correo de recuperación usando SMTP SSL/TLS de Xlerion
function sendRecoveryEmail($email, $token) {
    $baseUrl = getBaseUrl();
    $resetLink = $baseUrl . "/total-darkness/reset-password.html?token=" . urlencode($token);
    
    $subject = "Recuperación de Contraseña - Total Darkness";
    $htmlMessage = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; text-align: center; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🔒 Recuperación de Contraseña</h1>
                </div>
                <div class='content'>
                    <p>Hola,</p>
                    <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta de administrador en <strong>Total Darkness</strong>.</p>
                    <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                    <p style='text-align: center;'>
                        <a href='$resetLink' class='button'>Restablecer Contraseña</a>
                    </p>
                    <p>O copia y pega este enlace en tu navegador:</p>
                    <p style='word-break: break-all; background: #fff; padding: 10px; border-radius: 4px;'>$resetLink</p>
                    <p><strong>Este enlace es válido por 1 hora.</strong></p>
                    <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
                </div>
                <div class='footer'>
                    <p>Total Darkness - Story Management System</p>
                    <p>&copy; 2026 Xlerion. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
    ";
    
    return sendViaSmtp($email, $subject, $htmlMessage);
}

// Función para enviar correo vía SMTP SSL/TLS de Xlerion
function sendViaSmtp($to, $subject, $htmlMessage) {
    $host = SMTP_HOST;
    $port = SMTP_PORT;
    $username = SMTP_USERNAME;
    $password = SMTP_PASSWORD;
    $fromEmail = SMTP_FROM_EMAIL;
    $fromName = SMTP_FROM_NAME;
    
    try {
        // Conectar con SSL/TLS al servidor SMTP
        $connection = fsockopen("ssl://" . $host, $port, $errno, $errstr, 30);
        
        if (!$connection) {
            throw new Exception("Conexión SMTP fallida: $errstr ($errno)");
        }
        
        // Función auxiliar para enviar comandos SMTP
        $sendCommand = function($cmd) use ($connection) {
            fwrite($connection, $cmd . "\r\n");
            $response = fgets($connection, 1024);
            return $response;
        };
        
        // Recibir saludo del servidor
        $response = fgets($connection, 1024);
        if (substr($response, 0, 3) !== '220') {
            throw new Exception("Respuesta SMTP inválida: " . trim($response));
        }
        
        // EHLO
        $sendCommand("EHLO " . gethostname());
        
        // AUTH LOGIN
        $sendCommand("AUTH LOGIN");
        
        // Enviar usuario (base64)
        $sendCommand(base64_encode($username));
        
        // Enviar contraseña (base64)
        $sendCommand(base64_encode($password));
        
        // FROM
        $sendCommand("MAIL FROM:<$fromEmail>");
        
        // RCPT TO
        $sendCommand("RCPT TO:<$to>");
        
        // DATA
        $sendCommand("DATA");
        
        // Construir el mensaje MIME completo
        $message = "From: $fromName <$fromEmail>\r\n";
        $message .= "To: $to\r\n";
        $message .= "Subject: " . mb_encode_mimeheader($subject, 'UTF-8') . "\r\n";
        $message .= "MIME-Version: 1.0\r\n";
        $message .= "Content-Type: text/html; charset=UTF-8\r\n";
        $message .= "Content-Transfer-Encoding: 8bit\r\n";
        $message .= "\r\n";
        $message .= $htmlMessage;
        $message .= "\r\n";
        
        // Enviar mensaje
        fwrite($connection, $message . "\r\n.\r\n");
        $response = fgets($connection, 1024);
        
        if (substr($response, 0, 3) !== '250') {
            throw new Exception("Error al enviar mensaje: " . trim($response));
        }
        
        // QUIT
        $sendCommand("QUIT");
        
        fclose($connection);
        return true;
        
    } catch (Exception $e) {
        // Registrar error en log
        error_log("SMTP Error: " . $e->getMessage());
        return false;
    }
}

// Obtener acción solicitada
$input = json_decode(file_get_contents('php://input'), true) ?? [];
$action = $input['action'] ?? ($_GET['action'] ?? '');

// Si no hay acción, devolver estado del API
if (empty($action)) {
    header('Content-Type: application/json');
    http_response_code(200);
    echo json_encode([
        'status' => 'ok',
        'message' => 'API Total Darkness - Autenticación',
        'version' => '1.0'
    ]);
    exit;
}

try {
    switch ($action) {
        
        // ===== LOGIN =====
        case 'login':
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            
            if (empty($email) || empty($password)) {
                throw new Exception('Email y contraseña son requeridos');
            }
            
            $passwordHash = hash('sha256', $password);
            
            $stmt = $db->prepare("SELECT * FROM admins WHERE email = ? AND password_hash = ? AND active = 1");
            $stmt->execute([$email, $passwordHash]);
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($admin) {
                // Actualizar último login
                $db->prepare("UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?")
                   ->execute([$admin['id']]);
                
                // Generar token de sesión
                $sessionToken = bin2hex(random_bytes(32));
                
                echo json_encode([
                    'success' => true,
                    'user' => [
                        'id' => $admin['id'],
                        'email' => $admin['email'],
                        'name' => $admin['name'],
                        'sessionToken' => $sessionToken
                    ]
                ]);
            } else {
                // Delay para evitar ataques de fuerza bruta
                sleep(1);
                throw new Exception('Credenciales inválidas');
            }
            break;
        
        // ===== SOLICITAR RECUPERACIÓN =====
        case 'request-recovery':
            $email = $input['email'] ?? '';
            
            if (empty($email)) {
                throw new Exception('Email es requerido');
            }
            
            // Verificar que el email existe
            $stmt = $db->prepare("SELECT id FROM admins WHERE email = ? AND active = 1");
            $stmt->execute([$email]);
            
            if ($stmt->fetch()) {
                // Generar token único
                $token = bin2hex(random_bytes(32));
                $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));
                
                // Guardar token
                $stmt = $db->prepare("INSERT INTO recovery_tokens (email, token, expires_at) VALUES (?, ?, ?)");
                $stmt->execute([$email, $token, $expiresAt]);
                
                // Enviar correo
                if (sendRecoveryEmail($email, $token)) {
                    echo json_encode([
                        'success' => true,
                        'message' => 'Se ha enviado un correo con instrucciones para recuperar tu contraseña'
                    ]);
                } else {
                    throw new Exception('Error al enviar el correo. Por favor, contacta a contactus@xlerion.com');
                }
            } else {
                // Por seguridad, no revelamos si el email existe o no
                echo json_encode([
                    'success' => true,
                    'message' => 'Si el correo existe en nuestro sistema, recibirás instrucciones para recuperar tu contraseña'
                ]);
            }
            break;
        
        // ===== VALIDAR TOKEN =====
        case 'validate-token':
            $token = $input['token'] ?? '';
            
            if (empty($token)) {
                throw new Exception('Token es requerido');
            }
            
            $stmt = $db->prepare("
                SELECT * FROM recovery_tokens 
                WHERE token = ? AND used = 0 AND datetime(expires_at) > datetime('now')
            ");
            $stmt->execute([$token]);
            $recovery = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($recovery) {
                echo json_encode([
                    'success' => true,
                    'email' => $recovery['email']
                ]);
            } else {
                throw new Exception('Token inválido o expirado');
            }
            break;
        
        // ===== RESETEAR CONTRASEÑA =====
        case 'reset-password':
            $token = $input['token'] ?? '';
            $newPassword = $input['newPassword'] ?? '';
            
            if (empty($token) || empty($newPassword)) {
                throw new Exception('Token y nueva contraseña son requeridos');
            }
            
            if (strlen($newPassword) < 8) {
                throw new Exception('La contraseña debe tener al menos 8 caracteres');
            }
            
            // Validar token
            $stmt = $db->prepare("
                SELECT * FROM recovery_tokens 
                WHERE token = ? AND used = 0 AND datetime(expires_at) > datetime('now')
            ");
            $stmt->execute([$token]);
            $recovery = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$recovery) {
                throw new Exception('Token inválido o expirado');
            }
            
            // Actualizar contraseña
            $newPasswordHash = hash('sha256', $newPassword);
            $stmt = $db->prepare("UPDATE admins SET password_hash = ? WHERE email = ?");
            $stmt->execute([$newPasswordHash, $recovery['email']]);
            
            // Marcar token como usado
            $db->prepare("UPDATE recovery_tokens SET used = 1 WHERE token = ?")
               ->execute([$token]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Contraseña actualizada correctamente'
            ]);
            break;
        
        // ===== LISTAR ADMINISTRADORES =====
        case 'list-admins':
            $currentEmail = $input['currentEmail'] ?? '';
            $sessionToken = $input['sessionToken'] ?? '';
            
            if (empty($currentEmail)) {
                throw new Exception('No autorizado');
            }
            
            // Verificar que el usuario actual existe y está activo
            $stmt = $db->prepare("SELECT id FROM admins WHERE email = ? AND active = 1");
            $stmt->execute([$currentEmail]);
            if (!$stmt->fetch()) {
                throw new Exception('No autorizado');
            }
            
            // Obtener lista de administradores
            $stmt = $db->query("
                SELECT id, email, name, created_at, created_by, last_login, active 
                FROM admins 
                ORDER BY created_at DESC
            ");
            $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'admins' => $admins
            ]);
            break;
        
        // ===== CREAR ADMINISTRADOR =====
        case 'create-admin':
            $currentEmail = $input['currentEmail'] ?? '';
            $currentPassword = $input['currentPassword'] ?? '';
            $newEmail = $input['newEmail'] ?? '';
            $newPassword = $input['newPassword'] ?? '';
            $newName = $input['newName'] ?? '';
            
            if (empty($currentEmail) || empty($currentPassword)) {
                throw new Exception('Debes autenticarte para crear un nuevo administrador');
            }
            
            if (empty($newEmail) || empty($newPassword)) {
                throw new Exception('Email y contraseña del nuevo administrador son requeridos');
            }
            
            if (strlen($newPassword) < 8) {
                throw new Exception('La contraseña debe tener al menos 8 caracteres');
            }
            
            // Verificar credenciales del admin actual
            $currentPasswordHash = hash('sha256', $currentPassword);
            $stmt = $db->prepare("SELECT id FROM admins WHERE email = ? AND password_hash = ? AND active = 1");
            $stmt->execute([$currentEmail, $currentPasswordHash]);
            
            if (!$stmt->fetch()) {
                throw new Exception('Credenciales inválidas');
            }
            
            // Verificar que el nuevo email no existe
            $stmt = $db->prepare("SELECT id FROM admins WHERE email = ?");
            $stmt->execute([$newEmail]);
            if ($stmt->fetch()) {
                throw new Exception('Este email ya está registrado');
            }
            
            // Crear nuevo administrador
            $newPasswordHash = hash('sha256', $newPassword);
            $stmt = $db->prepare("
                INSERT INTO admins (email, password_hash, name, created_by)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([$newEmail, $newPasswordHash, $newName, $currentEmail]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Administrador creado correctamente',
                'admin' => [
                    'id' => $db->lastInsertId(),
                    'email' => $newEmail,
                    'name' => $newName
                ]
            ]);
            break;
        
        // ===== DESACTIVAR ADMINISTRADOR =====
        case 'deactivate-admin':
            $currentEmail = $input['currentEmail'] ?? '';
            $currentPassword = $input['currentPassword'] ?? '';
            $targetEmail = $input['targetEmail'] ?? '';
            
            if (empty($currentEmail) || empty($currentPassword)) {
                throw new Exception('Debes autenticarte para desactivar un administrador');
            }
            
            if (empty($targetEmail)) {
                throw new Exception('Email del administrador a desactivar es requerido');
            }
            
            if ($currentEmail === $targetEmail) {
                throw new Exception('No puedes desactivar tu propia cuenta');
            }
            
            // Verificar credenciales del admin actual
            $currentPasswordHash = hash('sha256', $currentPassword);
            $stmt = $db->prepare("SELECT id FROM admins WHERE email = ? AND password_hash = ? AND active = 1");
            $stmt->execute([$currentEmail, $currentPasswordHash]);
            
            if (!$stmt->fetch()) {
                throw new Exception('Credenciales inválidas');
            }
            
            // Desactivar administrador
            $stmt = $db->prepare("UPDATE admins SET active = 0 WHERE email = ?");
            $stmt->execute([$targetEmail]);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Administrador desactivado correctamente'
                ]);
            } else {
                throw new Exception('Administrador no encontrado');
            }
            break;
        
        default:
            throw new Exception('Acción no válida');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
