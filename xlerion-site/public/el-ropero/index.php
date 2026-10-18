<?php

define('LARAVEL_START', microtime(true));

// Check if vendor exists
if (!is_dir(__DIR__.'/../vendor')) {
    http_response_code(200);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'message' => 'El Ropero service - Laravel dependencies not installed',
        'status' => 'pending',
        'action' => 'Run: npm install && composer install in el-ropero directory'
    ]);
    exit(0);
}

// Load composer autoloader
require __DIR__.'/../vendor/autoload.php';

// For development: serve the welcome page directly
if (!function_exists('app')) {
    // Simple view renderer
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = rtrim($uri, '/') ?: '/';
    
    // Normalize path (remove /el-ropero prefix if present)
    if (strpos($uri, '/el-ropero') === 0) {
        $uri = substr($uri, 11);
        $uri = $uri ?: '/';
    }
    
    if ($uri === '/' || $uri === '') {
        http_response_code(200);
        header('Content-Type: text/html; charset=utf-8');
        
        ob_start();
        require __DIR__.'/../resources/views/welcome.blade.php';
        $content = ob_get_clean();
        echo $content;
        exit;
    }
    
    // API routes
    if (strpos($uri, '/api/') === 0) {
        http_response_code(200);
        header('Content-Type: application/json');
        
        // Simple API response
        echo json_encode([
            'message' => 'API endpoint: ' . $uri,
            'status' => 'development',
            'backend' => 'Laravel 11'
        ]);
        exit;
    }
    
    // 404
    http_response_code(404);
    echo 'Not Found';
    exit;
}
