<?php
// Test CORS
$url = 'http://localhost:8080/total-darkness/api/auth.php';

echo "Testing CORS headers at: $url\n\n";

// Test OPTIONS
echo "=== OPTIONS Request ===\n";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "OPTIONS");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_NOBODY, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

echo "HTTP Code: " . $info['http_code'] . "\n";
echo "Headers:\n";

// Parse headers
$lines = explode("\n", $response);
foreach ($lines as $line) {
    if (strpos($line, ':') !== false || strpos($line, 'HTTP') === 0) {
        echo "  " . trim($line) . "\n";
    }
}

echo "\nCORS Headers Present:\n";
preg_match_all('/Access-Control-[^:]+:\s*[^\n]+/', $response, $corsHeaders);
if (!empty($corsHeaders[0])) {
    foreach ($corsHeaders[0] as $header) {
        echo "  ✓ " . $header . "\n";
    }
} else {
    echo "  ✗ NO CORS HEADERS FOUND\n";
}
