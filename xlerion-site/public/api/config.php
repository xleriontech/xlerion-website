<?php
/**
 * Configuration loader for .env files
 * Loads environment variables from .env file in project root
 */

function loadEnv($filePath = null) {
    if (!$filePath) {
        // Try to find .env in parent directories
        $possible_paths = [
            __DIR__ . '/../../.env',      // In xlerion-site root
            __DIR__ . '/../.env',          // In public root
            dirname(__DIR__, 2) . '/.env', // Two levels up
        ];
        
        foreach ($possible_paths as $path) {
            if (file_exists($path)) {
                $filePath = $path;
                break;
            }
        }
    }
    
    if ($filePath && file_exists($filePath)) {
        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            // Skip comments
            if (strpos(trim($line), '#') === 0) {
                continue;
            }
            
            // Parse KEY=VALUE
            if (strpos($line, '=') !== false) {
                [$key, $value] = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                
                // Remove quotes if present
                if ((strpos($value, '"') === 0 && strrpos($value, '"') === strlen($value) - 1) ||
                    (strpos($value, "'") === 0 && strrpos($value, "'") === strlen($value) - 1)) {
                    $value = substr($value, 1, -1);
                }
                
                putenv("$key=$value");
                $_ENV[$key] = $value;
            }
        }
    }
}

// Auto-load .env on include
loadEnv();
?>
