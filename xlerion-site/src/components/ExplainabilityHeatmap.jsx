import React, { useEffect, useRef, useState } from 'react';
import { Zap, Eye, EyeOff } from 'lucide-react';

/**
 * Explainability Heatmap Overlay Component
 * Visualizes AI model attention/focus areas using Grad-CAM style heatmaps
 * Shows which regions of the image influenced the pest detection decisions
 */
export default function ExplainabilityHeatmap({ imageUrl, predictions = [], isVisible = true }) {
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const [opacity, setOpacity] = useState(0.5);
    const [heatmapType, setHeatmapType] = useState('gradcam'); // 'gradcam' | 'bbox' | 'attention'
    const [showLegend, setShowLegend] = useState(true);

    const renderHeatmap = React.useCallback(() => {
        if (!canvasRef.current || !imageRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = imageRef.current;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (heatmapType === 'gradcam') {
            renderGradCAMHeatmap(ctx, canvas.width, canvas.height);
        } else if (heatmapType === 'bbox') {
            renderBboxHeatmap(ctx, canvas.width, canvas.height);
        } else if (heatmapType === 'attention') {
            renderAttentionHeatmap(ctx, canvas.width, canvas.height);
        }
    }, [heatmapType]);

    useEffect(() => {
        if (!imageUrl || !isVisible) return;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            imageRef.current = img;
            renderHeatmap();
        };
        img.onerror = () => console.error('Failed to load image for heatmap');
        img.src = imageUrl;

        window.addEventListener('resize', renderHeatmap);
        return () => window.removeEventListener('resize', renderHeatmap);
    }, [imageUrl, isVisible, renderHeatmap]);

    useEffect(() => {
        renderHeatmap();
    }, [opacity, renderHeatmap]);

    /**
     * Render Grad-CAM style heatmap (simulated)
     * Shows model's focus areas with smooth gradients
     */
    const renderGradCAMHeatmap = (ctx, width, height) => {
        if (predictions.length === 0) {
            renderBackgroundActivation(ctx, width, height);
            return;
        }

        predictions.forEach((pred) => {
            const [x1, y1, x2, y2] = pred.bbox;
            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2;
            const w = x2 - x1;
            const h = y2 - y1;

            // Create radial gradient centered on detection
            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.sqrt(w * w + h * h));

            // Color based on confidence
            const confidence = pred.score;
            const hue = confidence > 0.8 ? 0 : confidence > 0.6 ? 20 : 40; // Red to yellow gradient

            gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.6)`);
            gradient.addColorStop(0.5, `hsla(${hue}, 100%, 50%, 0.3)`);
            gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        });

        // Apply opacity
        ctx.globalAlpha = opacity;
        ctx.fill();
    };

    /**
     * Render Bounding Box Heatmap
     * Shows attention as intensifying colors around detection boxes
     */
    const renderBboxHeatmap = (ctx) => {
        if (predictions.length === 0) return;

        ctx.globalAlpha = opacity;

        predictions.forEach((pred) => {
            const [x1, y1, x2, y2] = pred.bbox;
            const w = x2 - x1;
            const h = y2 - y1;
            const centerX = (x1 + x2) / 2;
            const centerY = (y1 + y2) / 2;

            // Confidence-based color
            const confidence = pred.score;
            const hue = confidence > 0.8 ? 0 : confidence > 0.6 ? 20 : 40;
            const saturation = confidence * 100;

            // Main detection box
            ctx.fillStyle = `hsla(${hue}, ${saturation}%, 50%, 0.7)`;
            ctx.fillRect(x1, y1, w, h);

            // Outer glow effect
            for (let i = 1; i <= 3; i++) {
                const radius = i * 15;
                ctx.strokeStyle = `hsla(${hue}, ${saturation}%, 50%, ${0.3 - i * 0.08})`;
                ctx.lineWidth = 2;
                ctx.strokeRect(
                    centerX - (w / 2 + radius),
                    centerY - (h / 2 + radius),
                    w + radius * 2,
                    h + radius * 2
                );
            }
        });
    };

    /**
     * Render Attention Map
     * Shows feature importance using color intensity
     */
    const renderAttentionHeatmap = (ctx, width, height) => {
        if (predictions.length === 0) {
            renderBackgroundActivation(ctx, width, height);
            return;
        }

        // Create attention heatmap image data
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        // Initialize heatmap values
        const heatmap = Array(width * height).fill(0);

        // Add activation for each detection
        predictions.forEach((pred) => {
            const [x1, y1, x2, y2] = pred.bbox;
            const confidence = pred.score;

            for (let y = Math.max(0, Math.floor(y1)); y < Math.min(height, Math.ceil(y2)); y++) {
                for (let x = Math.max(0, Math.floor(x1)); x < Math.min(width, Math.ceil(x2)); x++) {
                    // Distance from detection center
                    const cx = (x1 + x2) / 2;
                    const cy = (y1 + y2) / 2;
                    const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
                    const maxDist = Math.max(x2 - x1, y2 - y1);

                    // Decay with distance
                    const activation = confidence * Math.exp(-dist / maxDist);
                    const idx = (y * width + x) * 4;

                    heatmap[y * width + x] = Math.max(heatmap[y * width + x], activation);
                }
            }
        });

        // Apply colormap
        for (let i = 0; i < heatmap.length; i++) {
            const value = heatmap[i];
            const [r, g, b] = valueToHSL(value);

            data[i * 4] = r;     // Red
            data[i * 4 + 1] = g; // Green
            data[i * 4 + 2] = b; // Blue
            data[i * 4 + 3] = Math.round(opacity * 255); // Alpha
        }

        ctx.putImageData(imageData, 0, 0);
    };

    /**
     * Render background activation pattern (when no specific detections)
     */
    const renderBackgroundActivation = (ctx, width, height) => {
        ctx.globalAlpha = opacity;

        for (let i = 0; i < 5; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 50 + Math.random() * 100;

            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, 'rgba(255, 100, 100, 0.4)');
            gradient.addColorStop(0.5, 'rgba(255, 150, 50, 0.2)');
            gradient.addColorStop(1, 'rgba(255, 200, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(x - size, y - size, size * 2, size * 2);
        }
    };

    /**
     * Convert activation value to RGB
     * Red (high) -> Yellow (medium) -> Green (low)
     */
    const valueToHSL = (value) => {
        const hue = (1 - Math.min(1, value)) * 120; // 0-120 = red to green
        const saturation = 100;
        const lightness = 50;

        const c = ((100 - Math.abs(2 * lightness - 100)) * saturation) / 100;
        const x = (c * (1 - Math.abs(((hue / 60) % 2) - 1)));
        const m = lightness / 100 - c / 2;

        let r, g, b;
        if (hue < 60) {
            [r, g, b] = [c, x, 0];
        } else if (hue < 120) {
            [r, g, b] = [x, c, 0];
        } else if (hue < 180) {
            [r, g, b] = [0, c, x];
        } else if (hue < 240) {
            [r, g, b] = [0, x, c];
        } else if (hue < 300) {
            [r, g, b] = [x, 0, c];
        } else {
            [r, g, b] = [c, 0, x];
        }

        return [
            Math.round((r + m) * 255),
            Math.round((g + m) * 255),
            Math.round((b + m) * 255)
        ];
    };

    if (!isVisible) {
        return (
            <div className="p-4 bg-slate-800/50 rounded border border-cyan-500/20 text-center">
                <p className="text-gray-400 text-sm">Heatmap de explicabilidad desactivado</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Controls */}
            <div className="bg-slate-800/50 p-3 rounded border border-cyan-500/20 space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-cyan-400 flex items-center gap-2">
                        <Zap size={16} />
                        Mapa de Explicabilidad (XAI)
                    </h4>
                    <button
                        onClick={() => setShowLegend(!showLegend)}
                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                        {showLegend ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                </div>

                {/* Heatmap Type Selector */}
                <div className="grid grid-cols-3 gap-2">
                    {['gradcam', 'bbox', 'attention'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setHeatmapType(type)}
                            className={`py-1 px-2 text-xs rounded transition-colors ${heatmapType === type
                                ? 'bg-cyan-600 text-white'
                                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                }`}
                        >
                            {type === 'gradcam' ? 'Grad-CAM' : type === 'bbox' ? 'Bounding Box' : 'Attention'}
                        </button>
                    ))}
                </div>

                {/* Opacity Slider */}
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                        Opacidad: {Math.round(opacity * 100)}%
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={opacity}
                        onChange={(e) => setOpacity(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>

            {/* Canvas Heatmap */}
            <div className="relative bg-black/50 rounded-lg border border-cyan-500/20 overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full h-auto block"
                    style={{ maxHeight: '500px' }}
                />
                {predictions.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <p className="text-gray-500 text-sm">Sin detecciones para visualizar</p>
                    </div>
                )}
            </div>

            {/* Legend */}
            {showLegend && (
                <div className="bg-slate-800/50 p-3 rounded border border-cyan-500/20">
                    <p className="text-xs font-semibold text-cyan-400 mb-2">📊 Escala de Atención:</p>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-600 rounded"></div>
                            <span className="text-gray-400">Alta</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                            <span className="text-gray-400">Media</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span className="text-gray-400">Baja</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-slate-700 rounded"></div>
                            <span className="text-gray-400">Nula</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        El mapa muestra las regiones de la imagen que el modelo consideró al detectar plagas.
                    </p>
                </div>
            )}
        </div>
    );
}
