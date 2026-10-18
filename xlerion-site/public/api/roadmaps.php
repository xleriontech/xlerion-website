<?php
// API Endpoints para Sistema de Roadmaps
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/roadmap-errors.log');

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token');
header('Content-Type: application/json; charset=utf-8');

// Preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Paths
$templatesPath = realpath(__DIR__ . '/../../roadmaps.json');
$casesPath = realpath(__DIR__ . '/../../cases_examples.json');

// Helper: Load JSON file
function loadJSON($path) {
    if (!file_exists($path)) {
        return null;
    }
    $content = file_get_contents($path);
    return json_decode($content, true);
}

// Helper: Save JSON file (admin only)
function saveJSON($path, $data) {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return file_put_contents($path, $json) !== false;
}

// Helper: Simple admin auth (token-based)
function isAdmin() {
    $adminToken = getenv('ROADMAP_ADMIN_TOKEN') ?: 'xlerion_admin_2026';
    $headers = getallheaders();
    $token = $headers['X-Admin-Token'] ?? '';
    return $token === $adminToken;
}

// Parse request
$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);
$segments = array_filter(explode('/', $path));

// Get JSON body
$input = json_decode(file_get_contents('php://input'), true) ?? [];

// Route: GET /api/roadmaps/templates
if ($method === 'GET' && strpos($path, '/templates') !== false) {
    $templates = loadJSON($templatesPath);
    if (!$templates) {
        // Retornar estructura vacía en lugar de error 500
        echo json_encode([
            'success' => true,
            'data' => ['services' => []],
            'message' => 'Templates not available yet'
        ]);
        exit();
    }
    
    // Optional: filter by service
    $service = $_GET['service'] ?? null;
    if ($service && isset($templates['services'][$service])) {
        echo json_encode([
            'success' => true,
            'service' => $service,
            'data' => $templates['services'][$service]
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'data' => $templates
        ]);
    }
    exit();
}

// Route: GET /api/roadmaps/cases
if ($method === 'GET' && strpos($path, '/cases') !== false) {
    $cases = loadJSON($casesPath);
    if (!$cases) {
        // Retornar estructura vacía en lugar de error 500
        echo json_encode([
            'success' => true,
            'data' => [],
            'message' => 'Cases not available yet'
        ]);
        exit();
    }
    echo json_encode([
        'success' => true,
        'data' => $cases
    ]);
    exit();
}

// Route: POST /api/roadmaps/generate
if ($method === 'POST' && strpos($path, '/generate') !== false) {
    $required = ['service', 'subservice'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Missing required field: $field"]);
            exit();
        }
    }
    
    $templates = loadJSON($templatesPath);
    if (!$templates) {
        echo json_encode([
            'success' => false,
            'error' => 'Templates not available yet',
            'data' => []
        ]);
        exit();
    }
    
    $service = $input['service'];
    $subservice = $input['subservice'];
    $params = $input['parameters'] ?? [];
    
    // Validate service exists
    if (!isset($templates['services'][$service])) {
        http_response_code(404);
        echo json_encode(['error' => 'Service not found']);
        exit();
    }
    
    $serviceData = $templates['services'][$service];
    
    // Find subservice
    $subserviceData = null;
    foreach ($serviceData['subservices'] as $sub) {
        if ($sub['id'] === $subservice) {
            $subserviceData = $sub;
            break;
        }
    }
    
    if (!$subserviceData) {
        http_response_code(404);
        echo json_encode(['error' => 'Subservice not found']);
        exit();
    }
    
    // Generate roadmap based on parameters
    $sprints = $subserviceData['sprints'];
    $activeSprints = [];
    $totalWeeks = 0;
    
    // Check if Discovery sprint is needed
    $requirementsComplete = $params['requirements_complete'] ?? true;
    if (!$requirementsComplete) {
        $activeSprints[] = $sprints['S0'];
        $totalWeeks += $sprints['S0']['duration_weeks'];
    }
    
    // Process each sprint based on parameters
    foreach (['S1', 'S2', 'S3', 'S4'] as $sprintKey) {
        if (!isset($sprints[$sprintKey])) continue;
        
        $sprint = $sprints[$sprintKey];
        $include = true;
        
        // Check if sprint is affected by parameters
        foreach ($subserviceData['parameters'] as $param) {
            if (isset($param['affects']) && in_array($sprintKey, $param['affects'])) {
                $paramValue = $params[$param['key']] ?? null;
                
                // Skip sprint if parameter conditions not met
                if ($param['type'] === 'boolean' && !$paramValue) {
                    $include = false;
                    break;
                }
                if ($param['type'] === 'choice' && empty($paramValue)) {
                    $include = false;
                    break;
                }
            }
        }
        
        if ($include) {
            $activeSprints[] = $sprint;
            $totalWeeks += $sprint['duration_weeks'];
        }
    }
    
    // Add buffer if specified
    $bufferWeeks = 0;
    if (isset($subserviceData['buffers'])) {
        foreach ($subserviceData['buffers'] as $buffer) {
            if ($buffer['applies_when'] === 'always' || 
                ($buffer['applies_when'] === 'complex' && count($activeSprints) > 3)) {
                $bufferWeeks += $buffer['duration_weeks'];
            }
        }
    }
    
    $totalWeeks += $bufferWeeks;
    
    // Build response
    $response = [
        'success' => true,
        'roadmap' => [
            'service' => $service,
            'subservice' => $subservice,
            'parameters' => $params,
            'sprints' => $activeSprints,
            'total_sprints' => count($activeSprints),
            'total_weeks' => $totalWeeks,
            'buffer_weeks' => $bufferWeeks,
            'team' => $subserviceData['recommended_team'],
            'milestones' => $subserviceData['milestones'],
            'calibration_projects' => $subserviceData['recommended_calibration_projects'] ?? []
        ]
    ];
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit();
}

// Route: POST /api/roadmaps/validate
if ($method === 'POST' && strpos($path, '/validate') !== false) {
    $required = ['service', 'subservice', 'parameters'];
    foreach ($required as $field) {
        if (!isset($input[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Missing required field: $field"]);
            exit();
        }
    }
    
    $templates = loadJSON($templatesPath);
    if (!$templates) {
        echo json_encode([
            'success' => false,
            'error' => 'Templates not available yet',
            'data' => []
        ]);
        exit();
    }
    
    $service = $input['service'];
    $subservice = $input['subservice'];
    $params = $input['parameters'];
    
    // Find subservice data
    $subserviceData = null;
    if (isset($templates['services'][$service])) {
        foreach ($templates['services'][$service]['subservices'] as $sub) {
            if ($sub['id'] === $subservice) {
                $subserviceData = $sub;
                break;
            }
        }
    }
    
    if (!$subserviceData) {
        echo json_encode([
            'valid' => false,
            'errors' => ['Service or subservice not found']
        ]);
        exit();
    }
    
    // Validate parameters
    $errors = [];
    $warnings = [];
    
    foreach ($subserviceData['parameters'] as $paramDef) {
        $key = $paramDef['key'];
        $value = $params[$key] ?? null;
        
        if ($paramDef['required'] && $value === null) {
            $errors[] = "Missing required parameter: {$paramDef['label']['en']}";
        }
        
        if ($paramDef['type'] === 'choice' && $value !== null) {
            $validOptions = array_column($paramDef['options'], 'value');
            if (!in_array($value, $validOptions)) {
                $errors[] = "Invalid value for {$paramDef['label']['en']}";
            }
        }
    }
    
    // Check for warnings (e.g., incomplete requirements without Discovery)
    if (!empty($params['requirements_complete']) && $params['requirements_complete'] === false) {
        $warnings[] = 'Discovery sprint (S0) will be added due to incomplete requirements';
    }
    
    echo json_encode([
        'valid' => empty($errors),
        'errors' => $errors,
        'warnings' => $warnings
    ]);
    exit();
}

// Route: PUT /api/roadmaps/admin/update (admin only)
if ($method === 'PUT' && strpos($path, '/admin/update') !== false) {
    if (!isAdmin()) {
        http_response_code(403);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
    
    $type = $input['type'] ?? null; // 'templates' or 'cases'
    $data = $input['data'] ?? null;
    
    if (!$type || !$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing type or data']);
        exit();
    }
    
        echo json_encode([
            'success' => true,
            'message' => 'Templates updated successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Failed to save templates'
        ]);
    }
    exit();p_response_code(500);
        echo json_encode(['error' => 'Failed to save templates']);
    }
    exit();
}

// Route: GET /api/roadmaps/hours-to-sprints (conversion helper)
if ($method === 'GET' && strpos($path, '/hours-to-sprints') !== false) {
    $hours = isset($_GET['hours']) ? (float)$_GET['hours'] : null;
    $complexity = $_GET['complexity'] ?? 'medium'; // low, medium, high
    
    if (!$hours) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing hours parameter']);
        exit();
    }
    
    // Base calculation: 40 hours per sprint (1 week, 1 FTE)
    // Adjust for complexity and team availability
    $hoursPerSprint = 40;
    $availability = 0.80; // 80% productive time
    $complexityMultiplier = [
        'low' => 1.0,
        'medium' => 1.2,
        'high' => 1.5
    ][$complexity] ?? 1.2;
    
    $effectiveHours = $hours * $complexityMultiplier;
    $sprintCount = ceil($effectiveHours / ($hoursPerSprint * $availability));
    
    // Recommend sprint duration based on project size
    $sprintWeeks = $sprintCount <= 4 ? 2 : ($sprintCount <= 8 ? 3 : 4);
    $totalWeeks = $sprintCount * $sprintWeeks;
    
    echo json_encode([
        'success' => true,
        'input_hours' => $hours,
        'complexity' => $complexity,
        'estimated_sprints' => $sprintCount,
        'recommended_sprint_duration_weeks' => $sprintWeeks,
        'total_estimated_weeks' => $totalWeeks,
        'assumptions' => [
            'hours_per_sprint' => $hoursPerSprint,
            'team_availability' => $availability,
            'complexity_multiplier' => $complexityMultiplier
        ]
    ]);
    exit();
}

// Default: 404
http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);
