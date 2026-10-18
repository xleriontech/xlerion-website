import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Zap, Activity, AlertCircle, CheckCircle, Loader, MapPin, Calendar } from 'lucide-react';
import { uploadImage, inferImage } from '../../services/ai/apiClient';
import { connectTelemetry } from '../../services/ai/telemetry';
import { compressImage } from '../../utils/imageCompress';
import { generateMockDetections } from '../../utils/mockData';
import { analyzeDetectionsWithSeverity } from '../../utils/severityAnalysis';
import InferenceViewer from './InferenceViewer';
import EfficiencyPanel from './EfficiencyPanel';
import HUDPanel from './HUDPanel';
import DiagnosisPanel from '../DiagnosisPanel';
import MonitoringPanel from '../MonitoringPanel';

// Array of sample images from public/mock-data
const SAMPLE_IMAGES = [
    '/mock-data/coffee-plant-sample.png',
    '/mock-data/Cafe2.png'
];

export default function AIDetectionDemo() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [inferenceResult, setInferenceResult] = useState(null);
    const [error, setError] = useState(null);
    const [telemetryData, setTelemetryData] = useState(null);
    const [demoMode, setDemoMode] = useState('local'); // local demo mode (no external API)
    const [model, setModel] = useState('coffee-pest-v1');
    const [threshold, setThreshold] = useState(0.5);
    const [sampleHint, setSampleHint] = useState(null);
    const fileInputRef = useRef(null);
    const wsRef = useRef(null);

    // Agronomic Context Data
    const [contextData, setContextData] = useState({
        temperature: 22,
        humidity: 75,
        altitude: 1200,
        variety: 'Castillo',
        date: new Date(),
        hemisphere: 'NORTHERN_HEMISPHERE'
    });

    // Analysis History for Monitoring
    const [analysisHistory, setAnalysisHistory] = useState([]);

    // Mock token for demo (in production, would be obtained from auth)
    const [token, setToken] = useState(null);

    const requestDemoToken = React.useCallback(() => {
        // For local proxy tests, just set a placeholder token
        const mockToken = 'local_dev_token';
        setToken(mockToken);

        if (demoMode === 'remote') {
            try {
                wsRef.current = connectTelemetry(mockToken, handleTelemetryMessage);
            } catch {
                console.warn('Telemetry connection failed, continuing without WS');
            }
        }
    }, [demoMode]);

    useEffect(() => {
        // Request demo token on mount
        requestDemoToken();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [requestDemoToken]);

    const handleTelemetryMessage = (data) => {
        setTelemetryData(data);
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setError(null);
        setSampleHint(null);
        setInferenceResult(null);

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Por favor selecciona un archivo de imagen válido');
            return;
        }

        // Preview image
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);

        setSelectedImage(file);
    };

    const handleInference = async () => {
        if (!selectedImage) {
            setError('Por favor selecciona una imagen primero');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Compress image if too large
            let fileToUpload = selectedImage;
            if (selectedImage.size > 4 * 1024 * 1024) {
                fileToUpload = await compressImage(selectedImage, 0.8);
            }

            if (demoMode === 'remote') {
                // Remote inference via local PHP proxy/API
                const uploadResult = await uploadImage(fileToUpload, token);
                const inferResult = await inferImage(
                    uploadResult.url,
                    token,
                    model,
                    threshold
                );
                setInferenceResult(inferResult);
                appendAnalysisToHistory(inferResult.predictions);
            } else {
                // Local demo mode with synthetic results
                await simulateLocalInference();
            }
        } catch (err) {
            console.error('Inference error:', err);
            setError('No se pudo conectar al servicio remoto, cambiando a modo local');

            // Fallback to local mode
            if (demoMode === 'remote') {
                setDemoMode('local');
                await simulateLocalInference();
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const simulateLocalInference = async () => {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Local demo: use deterministic/mock detections only (no color heuristic)
        const mockPredictions = generateMockDetections(2, sampleHint);

        const mockResult = {
            requestId: 'demo_' + Date.now(),
            predictions: mockPredictions,
            explain: {
                gradcamUrl: null,
                method: 'Grad-CAM'
            },
            metadata: {
                inferenceTime: 245,
                model: model,
                confidence: threshold
            }
        };

        setInferenceResult(mockResult);
        appendAnalysisToHistory(mockPredictions);
    };

    const buildDetectionForClass = (pestClass) => ({
        class: pestClass,
        score: 0.82,
        bbox: [120, 80, 520, 420],
        maskUrl: null
    });

    // Lightweight heuristic: detect rust (orange) vs broca (dark perforations)
    const detectPestFromPreview = (previewUrl) => new Promise((resolve) => {
        if (!previewUrl) return resolve(null);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const targetWidth = 256;
                const targetHeight = Math.floor((img.height / img.width) * targetWidth) || 256;
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                const { data } = ctx.getImageData(0, 0, targetWidth, targetHeight);

                let orangeCount = 0;
                let darkCount = 0;
                let total = data.length / 4;

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i] / 255;
                    const g = data[i + 1] / 255;
                    const b = data[i + 2] / 255;

                    // HSV conversion (approx) to detect orange/yellow rust spots
                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    const delta = max - min;
                    let hue = 0;
                    if (delta !== 0) {
                        if (max === r) hue = ((g - b) / delta) % 6;
                        else if (max === g) hue = (b - r) / delta + 2;
                        else hue = (r - g) / delta + 4;
                        hue *= 60;
                        if (hue < 0) hue += 360;
                    }
                    const sat = max === 0 ? 0 : delta / max;
                    const val = max;

                    const isOrange = hue >= 20 && hue <= 55 && sat > 0.4 && val > 0.35;
                    const isDark = val < 0.22 && sat < 0.4;
                    if (isOrange) orangeCount += 1;
                    if (isDark) darkCount += 1;
                }

                const orangeRatio = orangeCount / total;
                const darkRatio = darkCount / total;

                // Rust: orange clearly dominates
                if (orangeRatio > 0.04 && orangeRatio >= darkRatio * 2) return resolve('Roya del café');
                // Broca: dark clearly dominates
                if (darkRatio > 0.04 && darkRatio >= orangeRatio * 2) return resolve('Broca del café');
            } catch (e) {
                // ignore heuristic errors
            }
            return resolve(null);
        };

        img.onerror = () => resolve(null);
        img.src = previewUrl;
    });

    const appendAnalysisToHistory = (predictions = []) => {
        const analysis = analyzeDetectionsWithSeverity(predictions, {
            ...contextData,
            date: new Date()
        });

        setAnalysisHistory((prev) => ([
            ...prev,
            {
                ...analysis,
                timestamp: new Date()
            }
        ]));
    };

    const handleUseSampleImage = async () => {
        // Select a random sample image from the array
        const randomIndex = Math.floor(Math.random() * SAMPLE_IMAGES.length);
        const sampleUrl = SAMPLE_IMAGES[randomIndex];

        try {
            const response = await fetch(sampleUrl);
            const blob = await response.blob();
            const fileName = sampleUrl.split('/').pop() || 'sample.png';
            const file = new File([blob], fileName, { type: 'image/png' });

            setSelectedImage(file);
            setImagePreview(sampleUrl);
            setError(null);
            setSampleHint(sampleUrl);
            setInferenceResult(null);
        } catch {
            setError('No se pudo cargar la imagen de ejemplo');
        }
    };

    return (
        <div className="space-y-8">
            {/* Disclaimer Alert */}
            <div className="bg-amber-950/40 border-l-4 border-amber-500 rounded-r p-4">
                <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-100">
                        <p className="font-semibold text-amber-300 mb-1">
                            ⚠️ Demostración Educativa
                        </p>
                        <p>
                            Este demo utiliza <strong>detecciones sintéticas</strong> y no es funcional en producción.
                            Para implementación en campo se requiere: modelo entrenado con datos reales,
                            infraestructura de servidor robusto, base de datos agrícola, y validación con expertos agronómicos.
                            Este prototipo es solo para fines ilustrativos.
                        </p>
                    </div>
                </div>
            </div>

            {/* Header Controls */}
            <div className="bg-[#1a1a1a] border border-[#00e9fa]/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#00e9fa]">
                        Demo de Detección de Plagas con IA
                    </h3>
                    <div className="flex items-center gap-2">
                        {demoMode === 'local' && (
                            <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 text-xs font-mono rounded">
                                MODO LOCAL
                            </span>
                        )}
                        {isProcessing && (
                            <Loader className="text-[#00e9fa] animate-spin" size={20} />
                        )}
                    </div>
                </div>

                {/* Model Selection */}
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-400 text-xs font-mono mb-2">
                            Modelo
                        </label>
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 text-white px-3 py-2 rounded text-sm"
                            disabled={isProcessing}
                        >
                            <option value="coffee-pest-v1">Coffee Pest Detector v1</option>
                            <option value="coffee-pest-v2">Coffee Pest Detector v2 (Beta)</option>
                            <option value="general-plant-disease">General Plant Disease</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs font-mono mb-2">
                            Umbral de Confianza: {threshold.toFixed(2)}
                        </label>
                        <input
                            type="range"
                            min="0.1"
                            max="0.95"
                            step="0.05"
                            value={threshold}
                            onChange={(e) => setThreshold(parseFloat(e.target.value))}
                            className="w-full"
                            disabled={isProcessing}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs font-mono mb-2">
                            Modo
                        </label>
                        <select
                            value={demoMode}
                            onChange={(e) => setDemoMode(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 text-white px-3 py-2 rounded text-sm"
                            disabled={isProcessing}
                        >
                            <option value="remote">Inferencia Remota (xlerion.com)</option>
                            <option value="local">Demo Local (Sintético)</option>
                        </select>
                    </div>
                </div>

                {/* Upload Controls */}
                <div className="flex gap-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessing}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Upload size={18} />
                        <span className="font-mono text-sm">Subir Imagen</span>
                    </button>

                    <button
                        onClick={handleUseSampleImage}
                        disabled={isProcessing}
                        className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
                    >
                        Usar Ejemplo
                    </button>

                    <button
                        onClick={handleInference}
                        disabled={!selectedImage || isProcessing}
                        className="flex items-center gap-2 px-6 py-3 bg-[#00e9fa] hover:bg-[#00d4e0] text-black rounded font-mono text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <>
                                <Loader size={18} className="animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            <>
                                <Play size={18} />
                                Analizar
                            </>
                        )}
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded flex items-center gap-2">
                        <AlertCircle size={18} className="text-red-400" />
                        <span className="text-red-300 text-sm">{error}</span>
                    </div>
                )}
            </div>

            {/* HUD Panel - Real-time Status */}
            <HUDPanel
                isProcessing={isProcessing}
                hasResults={!!inferenceResult}
                telemetryData={telemetryData}
            />

            {/* Main Viewer */}
            {imagePreview && (
                <InferenceViewer
                    imageUrl={imagePreview}
                    predictions={inferenceResult?.predictions}
                    explainData={inferenceResult?.explain}
                    isProcessing={isProcessing}
                />
            )}

            {/* Efficiency Panel */}
            {inferenceResult && (
                <EfficiencyPanel
                    inferenceResult={inferenceResult}
                    telemetryData={telemetryData}
                />
            )}

            {/* Success Message */}
            {inferenceResult && !isProcessing && (
                <div className="p-4 bg-green-900/20 border border-green-500/50 rounded flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-400" />
                    <div>
                        <p className="text-green-300 font-mono text-sm">
                            Análisis completado: {inferenceResult.predictions.length} detección(es)
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                            Tiempo de inferencia: {inferenceResult.metadata?.inferenceTime || 0}ms
                        </p>
                    </div>
                </div>
            )}

            {/* Agronomic Context Configuration */}
            <div className="bg-[#1a1a1a] border border-[#00e9fa]/30 rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#00e9fa] mb-4">📍 Contexto Agronómico</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-400 text-xs font-mono mb-2">Temperatura (°C)</label>
                        <input
                            type="number"
                            min="10"
                            max="35"
                            value={contextData.temperature}
                            onChange={(e) => setContextData({ ...contextData, temperature: parseFloat(e.target.value) })}
                            className="w-full bg-black/50 border border-white/10 text-white px-3 py-2 rounded text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-mono mb-2">Humedad Relativa (%)</label>
                        <input
                            type="number"
                            min="30"
                            max="100"
                            value={contextData.humidity}
                            onChange={(e) => setContextData({ ...contextData, humidity: parseFloat(e.target.value) })}
                            className="w-full bg-black/50 border border-white/10 text-white px-3 py-2 rounded text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-mono mb-2">Altitud (msnm)</label>
                        <input
                            type="number"
                            min="600"
                            max="2500"
                            value={contextData.altitude}
                            onChange={(e) => setContextData({ ...contextData, altitude: parseFloat(e.target.value) })}
                            className="w-full bg-black/50 border border-white/10 text-white px-3 py-2 rounded text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-mono mb-2">Variedad</label>
                        <select
                            value={contextData.variety}
                            onChange={(e) => setContextData({ ...contextData, variety: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 text-white px-3 py-2 rounded text-sm"
                        >
                            <option>Castillo</option>
                            <option>Geisha</option>
                            <option>Bourbon</option>
                            <option>Typica</option>
                            <option>Caturra</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-mono mb-2">Hemisferio</label>
                        <select
                            value={contextData.hemisphere}
                            onChange={(e) => setContextData({ ...contextData, hemisphere: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 text-white px-3 py-2 rounded text-sm"
                        >
                            <option value="NORTHERN_HEMISPHERE">Northern</option>
                            <option value="SOUTHERN_HEMISPHERE">Southern</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Diagnosis Panel with Agronomic Analysis */}
            {inferenceResult && (
                <DiagnosisPanel
                    detections={inferenceResult.predictions}
                    contextData={contextData}
                />
            )}

            {/* Monitoring Panel with Historical Data */}
            {analysisHistory.length > 0 && (
                <MonitoringPanel analyses={analysisHistory} />
            )}
        </div>
    );
}
