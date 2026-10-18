<?php
// Inference proxy endpoint for AI demo
// Accepts JSON { fileUrl, model, threshold } and proxies to external inference API
// Falls back to a mock response if external API is not configured

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

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON payload']);
    exit;
}

$fileUrl = $data['fileUrl'] ?? null;
$model = $data['model'] ?? 'coffee-pest-v1';
$threshold = isset($data['threshold']) ? floatval($data['threshold']) : 0.5;

if (!$fileUrl) {
    http_response_code(400);
    echo json_encode(['error' => 'fileUrl is required']);
    exit;
}

// Load file contents
$filePath = null;
if (strpos($fileUrl, '/api/uploads/') !== false) {
    // Local upload
    $basename = basename(parse_url($fileUrl, PHP_URL_PATH));
    $candidate = __DIR__ . '/../uploads/' . $basename;
    if (is_readable($candidate)) {
        $filePath = $candidate;
    }
}

$tmpFile = null;
if (!$filePath) {
    // Try to download the file
    $tmpFile = tempnam(sys_get_temp_dir(), 'infer_');
    $fp = fopen($tmpFile, 'w');
    $ch = curl_init($fileUrl);
    curl_setopt($ch, CURLOPT_FILE, $fp);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_FAILONERROR, true);
    $ok = curl_exec($ch);
    fclose($fp);
    if ($ok === false) {
        @unlink($tmpFile);
        http_response_code(400);
        echo json_encode(['error' => 'Unable to fetch fileUrl']);
        exit;
    }
    $filePath = $tmpFile;
}

// Roboflow inference config (DISABLED for local demo)
// To enable: set ROBOFLOW_API_KEY in cPanel and change the condition below
if (false) { // Disabled - using mock only
    // Call Roboflow hosted inference API with base64 image
    $base64Image = base64_encode(file_get_contents($filePath));
    $endpoint = "https://detect.roboflow.com/{$roboflowWorkspace}/{$roboflowVersion}?api_key={$roboflowApiKey}&confidence={$threshold}";
    
    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $base64Image);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/x-www-form-urlencoded'
    ]);
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    if ($tmpFile) {
        @unlink($tmpFile);
    }

    if ($response === false) {
        http_response_code(502);
        echo json_encode(['error' => 'Roboflow API error: ' . $err]);
        exit;
    }

    if ($status >= 200 && $status < 300) {
        // Transform Roboflow response to our format
        $roboflowData = json_decode($response, true);
        $predictions = [];
        
        if (isset($roboflowData['predictions']) && is_array($roboflowData['predictions'])) {
            foreach ($roboflowData['predictions'] as $pred) {
                $predictions[] = [
                    'class' => $pred['class'] ?? 'Unknown',
                    'score' => $pred['confidence'] ?? 0,
                    'bbox' => [
                        round(($pred['x'] ?? 0) - ($pred['width'] ?? 0) / 2),
                        round(($pred['y'] ?? 0) - ($pred['height'] ?? 0) / 2),
                        round(($pred['x'] ?? 0) + ($pred['width'] ?? 0) / 2),
                        round(($pred['y'] ?? 0) + ($pred['height'] ?? 0) / 2)
                    ]
                ];
            }
        }
        
        $result = [
            'requestId' => 'roboflow_' . time(),
            'predictions' => $predictions,
            'explain' => [
                'gradcamUrl' => null,
                'method' => 'Roboflow'
            ],
            'metadata' => [
                'model' => $model,
                'threshold' => $threshold,
                'inferenceTime' => $roboflowData['time'] ?? 0
            ]
        ];
        
        http_response_code(200);
        echo json_encode($result);
        exit;
    }

    http_response_code($status ?: 502);
    echo $response;
    exit;
}

// Fallback mock (no external endpoint configured)
if ($tmpFile) {
    @unlink($tmpFile);
}

$mock = [
    'requestId' => 'mock_' . time(),
    'predictions' => [
        [
            'class' => 'Roya del café',
            'score' => 0.82,
            'bbox' => [120, 80, 520, 420]
        ],
        [
            'class' => 'Broca del café',
            'score' => 0.41,
            'bbox' => [220, 180, 360, 320]
        ]
    ],
    'explain' => [
        'gradcamUrl' => null,
        'method' => 'Grad-CAM'
    ],
    'metadata' => [
        'model' => $model,
        'threshold' => $threshold,
        'inferenceTime' => 240
    ]
];

http_response_code(200);
echo json_encode($mock);
