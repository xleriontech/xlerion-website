import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Maximize2 } from 'lucide-react';

export default function InferenceViewer({ imageUrl, predictions = [], explainData = null, isProcessing = false }) {
    const canvasRef = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    const getColorForClass = useCallback((index) => {
        const colors = ['#00e9fa', '#00ff88', '#ff6b35', '#ffdd00', '#bb86fc'];
        return colors[index % colors.length];
    }, []);

    const getRecommendation = useCallback((pestName = '') => {
        const normalized = pestName.toLowerCase();
        if (normalized.includes('broca')) {
            return 'Aplicar control biológico con Beauveria bassiana y monitoreo de frutos perforados.';
        }
        if (normalized.includes('roya')) {
            return 'Retirar hojas infectadas y aplicar fungicida sistémico específico para roya.';
        }
        if (normalized.includes('minador')) {
            return 'Podar hojas afectadas y usar trampas adhesivas amarillas para adultos.';
        }
        if (normalized.includes('cochinilla')) {
            return 'Lavar con agua y jabón potásico; evaluar uso de aceite hortícola.';
        }
        if (normalized.includes('antracnosis')) {
            return 'Mejorar ventilación, reducir humedad y aplicar fungicida de contacto.';
        }
        return 'Revisar el foco señalado y aplicar manejo integrado según umbral de daño.';
    }, []);

    // Normalize bbox that may come as [x1,y1,x2,y2] absolute or [x,y,w,h] normalized/absolute
    const toBox = useCallback((bbox, width, height) => {
        if (!bbox || bbox.length < 4) return null;
        const [a, b, c, d] = bbox.map(Number);

        // If all values <= 1, assume normalized [x, y, w, h]
        const normalized = [a, b, c, d].every((v) => v >= 0 && v <= 1);

        if (normalized) {
            const x1 = a * width;
            const y1 = b * height;
            const x2 = x1 + c * width;
            const y2 = y1 + d * height;
            return [x1, y1, x2, y2];
        }

        // If c/d look like width/height (non-normalized but small), treat accordingly
        const looksLikeSize = c > 0 && d > 0 && (c <= width / 2 || d <= height / 2);
        if (looksLikeSize && (c + a <= width) && (d + b <= height)) {
            const x1 = a;
            const y1 = b;
            const x2 = a + c;
            const y2 = b + d;
            return [x1, y1, x2, y2];
        }

        // Default: assume already [x1,y1,x2,y2]
        return [a, b, c, d];
    }, []);

    const drawPredictions = useCallback((ctx, predictions) => {
        predictions.forEach((pred, index) => {
            const box = toBox(pred.bbox, ctx.canvas.width, ctx.canvas.height);
            if (!box) return;

            const [x1, y1, x2, y2] = box;
            const color = getColorForClass(index);

            // Fill zone to make it immediately visible
            ctx.fillStyle = `${color}55`;
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

            // Draw bounding box
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

            // Draw label background
            const label = `${pred.class} (${(pred.score * 100).toFixed(1)}%)`;
            ctx.font = 'bold 14px monospace';
            const textMetrics = ctx.measureText(label);
            const labelHeight = 24;
            const labelWidth = textMetrics.width + 16;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(x1, y1 - labelHeight, labelWidth, labelHeight);

            // Draw label text
            ctx.fillStyle = color;
            ctx.fillText(label, x1 + 8, y1 - 8);

            // Draw confidence indicator
            const confidenceBar = (x2 - x1) * pred.score;
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.3;
            ctx.fillRect(x1, y2 - 4, confidenceBar, 4);
            ctx.globalAlpha = 1.0;
        });
    }, [getColorForClass, toBox]);

    useEffect(() => {
        if (!imageUrl || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();

        const render = (imgEl) => {
            // Set canvas size to match image
            canvas.width = imgEl.width;
            canvas.height = imgEl.height;

            // Draw base image
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imgEl, 0, 0);

            // Draw bounding boxes and labels
            if (predictions.length > 0 && !isProcessing) {
                drawPredictions(ctx, predictions);
            }

            setImageLoaded(true);
        };

        img.onload = () => render(img);
        img.src = imageUrl;

        // If image is cached, onload may not fire; render synchronously
        if (img.complete && img.naturalWidth) {
            render(img);
        }
    }, [imageUrl, predictions, isProcessing, explainData, drawPredictions]);

    const handleFullscreen = () => {
        if (canvasRef.current) {
            canvasRef.current.requestFullscreen();
        }
    };

    return (
        <div className="bg-[#1a1a1a] border border-[#00e9fa]/30 rounded-lg overflow-hidden">
            {/* Controls Bar */}
            <div className="border-b border-white/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-400">Zonas de riesgo resaltadas</span>
                </div>

                <button
                    onClick={handleFullscreen}
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded transition-colors"
                    disabled={!imageLoaded}
                >
                    <Maximize2 size={16} />
                </button>
            </div>

            {/* Canvas Viewer */}
            <div className="relative bg-black flex items-center justify-center min-h-[400px] max-h-[600px] overflow-auto">
                {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#00e9fa] border-t-transparent"></div>
                            <p className="mt-4 text-[#00e9fa] font-mono text-sm">Procesando imagen...</p>
                        </div>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto"
                    style={{ imageRendering: 'crisp-edges', display: 'block' }}
                />
            </div>

            {/* Detection Info */}
            {/* Detailed Detection Results */}
            {predictions.length > 0 && !isProcessing && (
                <div className="border-t border-white/10 p-6 bg-black">
                    <h3 className="text-lg font-bold text-[#00e9fa] mb-6">Plagas Detectadas</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {predictions.map((pred, index) => (
                            <div
                                key={index}
                                className="bg-[#1a1a1a] border-l-4 p-4 rounded-lg hover:bg-[#222] transition-colors"
                                style={{ borderLeftColor: getColorForClass(index) }}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: getColorForClass(index) }}
                                        />
                                        <div>
                                            <p className="font-bold text-white text-base">{pred.class}</p>
                                            <p className="text-[#00e9fa] text-sm font-mono">
                                                Confianza: {(pred.score * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#00e9fa]/20 to-transparent rounded-lg flex items-center justify-center">
                                            <span className="text-xl font-bold text-[#00e9fa]">
                                                {(pred.score * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-black/50 rounded p-3 mb-3">
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        <span className="font-mono text-[#00ff88]">💡 Recomendación: </span>
                                        {getRecommendation(pred.class)}
                                    </p>
                                </div>
                                {pred.bbox && (
                                    <p className="text-gray-500 text-xs font-mono">
                                        Ubicación: [{pred.bbox.join(', ')}]
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}