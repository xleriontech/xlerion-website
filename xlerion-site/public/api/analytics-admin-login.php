<?php
/**
 * Admin Login for Analytics
 * Sets a session flag when password is verified
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

session_start();

$input = json_decode(file_get_contents('php://input'), true);
$password = $input['password'] ?? '';

if (!$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Password required']);
    exit;
}

$adminHash = getenv('ANALYTICS_ADMIN_PASS_HASH');
if (!$adminHash) {
    // Default hash for initial deployment (password is not stored in plain text)
    $adminHash = '$2y$12$IVqHUazluws2A7..gNJhduf1GfmDjCzhZWjCKHEh6qGZs5Tfr7hJ.';
}

if (password_verify($password, $adminHash)) {
    $_SESSION['analytics_admin'] = true;
    http_response_code(200);
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(401);
echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
