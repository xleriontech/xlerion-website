// Mock data generator for AI demo
// Generates synthetic pest detection data for offline/local demo mode

/**
 * Generate synthetic detection results for demo
 * If a sampleHint matches a known sample image, return deterministic labels
 * @param {number} numDetections - Number of detections to generate
 * @param {string|null} sampleHint - Optional sample image path/name
 * @returns {Array} Array of prediction objects
 */
export function generateMockDetections(numDetections = 2, sampleHint = null) {
    // Deterministic mocks for bundled sample images
    const deterministicMap = [
        { match: 'coffee-plant-sample', pests: ['Roya del café', 'Mancha angular'] },
        { match: 'Cafe2', pests: ['Broca del café'] },
        { match: 'Cafe3', pests: ['Ácaro rojo'] }
    ];

    if (sampleHint) {
        const matched = deterministicMap.find(entry => sampleHint.includes(entry.match));
        if (matched) {
            return matched.pests.slice(0, numDetections).map((pest, idx) => ({
                class: pest,
                score: 0.82 - idx * 0.05,
                bbox: [120 + idx * 30, 80 + idx * 20, 320 + idx * 30, 260 + idx * 25],
                maskUrl: null
            }));
        }
    }

    const pestClasses = [
        'Broca del café',
        'Minador de la hoja',
        'Cochinilla',
        'Antracnosis',
        'Ácaro rojo',
        'Nematodo del nudo de la raíz',
        'Mancha angular'
    ];

    const predictions = [];
    const selectedPests = new Set();

    for (let i = 0; i < numDetections; i++) {
        // Avoid duplicate pest classes in single inference
        let pestClass;
        do {
            pestClass = pestClasses[Math.floor(Math.random() * pestClasses.length)];
        } while (selectedPests.has(pestClass) && selectedPests.size < pestClasses.length);
        selectedPests.add(pestClass);

        const x1 = Math.random() * 600;
        const y1 = Math.random() * 400;
        const width = Math.random() * 150 + 80;
        const height = Math.random() * 150 + 80;

        // More realistic confidence scores: mostly 0.5-0.85 range
        const confidence = Math.random() < 0.7
            ? Math.random() * 0.25 + 0.55  // 0.55-0.80 (more common, realistic)
            : Math.random() * 0.15 + 0.80; // 0.80-0.95 (less common, high confidence)

        predictions.push({
            class: pestClass,
            score: Math.min(0.95, Math.max(0.5, confidence)),
            bbox: [
                Math.floor(x1),
                Math.floor(y1),
                Math.floor(x1 + width),
                Math.floor(y1 + height)
            ],
            maskUrl: null
        });
    }

    return predictions;
}

/**
 * Generate mock inference result
 * @param {string} model - Model identifier
 * @param {number} threshold - Confidence threshold
 * @returns {Object} Complete inference result
 */
export function generateMockInferenceResult(model = 'coffee-pest-v1', threshold = 0.5) {
    const predictions = generateMockDetections(Math.floor(Math.random() * 3) + 1);

    // Filter by threshold
    const filteredPredictions = predictions.filter(p => p.score >= threshold);

    return {
        requestId: 'mock_' + Date.now(),
        predictions: filteredPredictions,
        explain: {
            gradcamUrl: null, // Synthetic heatmap will be generated in viewer
            method: 'Grad-CAM',
            confidence: filteredPredictions.length > 0
                ? filteredPredictions.reduce((sum, p) => sum + p.score, 0) / filteredPredictions.length
                : 0
        },
        metadata: {
            inferenceTime: Math.floor(Math.random() * 150) + 150, // 150-300ms
            model: model,
            confidence: threshold,
            timestamp: Date.now()
        }
    };
}

/**
 * List of sample images for demo
 */
export const SAMPLE_IMAGES = [
    {
        id: 'sample-1',
        url: '/mock-data/coffee-plant-sample-1.jpg',
        name: 'Planta con broca del café',
        description: 'Imagen de ejemplo con presencia de broca'
    },
    {
        id: 'sample-2',
        url: '/mock-data/coffee-plant-sample-2.jpg',
        name: 'Hoja con roya',
        description: 'Ejemplo de infección por roya del café'
    },
    {
        id: 'sample-3',
        url: '/mock-data/coffee-plant-sample-3.jpg',
        name: 'Múltiples plagas',
        description: 'Detección simultánea de varias plagas'
    }
];

/**
 * Generate synthetic telemetry snapshot
 * @returns {Object} Telemetry data
 */
export function generateMockTelemetry() {
    return {
        timestamp: Date.now(),
        queueSize: Math.floor(Math.random() * 5),
        rate: (Math.random() * 2 + 0.5).toFixed(1),
        latency: Math.floor(Math.random() * 100 + 150),
        cpuLoad: `${Math.floor(Math.random() * 30 + 10)}%`,
        throughput: `${(Math.random() * 2 + 0.5).toFixed(1)} img/s`,
        activeJobs: Math.floor(Math.random() * 3),
        completedJobs: Math.floor(Math.random() * 100)
    };
}
