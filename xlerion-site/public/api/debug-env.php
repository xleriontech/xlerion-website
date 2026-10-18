<?php
// Cargar .env manualmente
$envPath = realpath(__DIR__ . '/../../.env');

if (!$envPath || !file_exists($envPath)) {
    die(json_encode(['error' => '.env file not found. Searched at: ' . ($envPath ?: __DIR__ . '/../../.env')]));
}

$env = file_get_contents($envPath);
echo '<pre>';
echo "ENV file exists: YES\n";
echo "ENV file path: $envPath\n";
echo "ENV file size: " . filesize($envPath) . " bytes\n";
echo "\nFirst 30 lines of .env:\n";
$lines = explode("\n", $env);
for ($i = 0; $i < min(30, count($lines)); $i++) {
    echo ($i+1) . ": " . htmlspecialchars($lines[$i]) . "\n";
}
echo '</pre>';
?>
