<?php
// Simple upload endpoint for AI demo
// Saves file to uploads/ and returns a public URL

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded']);
    exit;
}

$file = $_FILES['file'];

// Basic validation
$maxSize = 8 * 1024 * 1024; // 8 MB
if ($file['size'] > $maxSize) {
    http_response_code(413);
    echo json_encode(['error' => 'File too large']);
    exit;
}

$allowed = ['image/jpeg', 'image/png', 'image/webp'];
if (!in_array($file['type'], $allowed, true)) {
    http_response_code(415);
    echo json_encode(['error' => 'Unsupported file type']);
    exit;
}

$uploadDir = __DIR__ . '/../uploads';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$ext = pathinfo($file['name'], PATHINFO_EXTENSION) ?: 'bin';
$basename = bin2hex(random_bytes(8));
$target = $uploadDir . '/' . $basename . '.' . $ext;

if (!move_uploaded_file($file['tmp_name'], $target)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file']);
    exit;
}

// Build public URL
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$publicUrl = $scheme . '://' . $host . '/api/uploads/' . basename($target);

// Ensure uploads are web-accessible
$publicDir = __DIR__ . '/../uploads';
if (!is_dir($publicDir)) {
    mkdir($publicDir, 0755, true);
}

http_response_code(200);
echo json_encode([
    'fileId' => $basename,
    'url' => $publicUrl,
    'size' => $file['size'],
    'type' => $file['type']
]);
