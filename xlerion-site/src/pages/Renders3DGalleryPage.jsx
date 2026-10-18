import { useLanguage } from "../context/LanguageContext";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import rendersConfig from "../data/rendersConfig.json";
import { generateRenderMetadata } from "../utils/renderMetadataGenerator";
import { useAnalytics } from '../hooks/useAnalytics';

// Initialize renders from config and validate that images exist
const initializeRenders = () => {
    return rendersConfig.renders.map((render, index) => {
        const auto = generateRenderMetadata(render.filename);
        return {
            id: index + 1,
            image: `/images/renders/${render.filename}`,
            // Prefer filename-derived metadata when available; fallback to config
            title: auto.title ?? render.title,
            description: auto.description ?? render.description,
            software: (auto.software && auto.software.length > 0) ? auto.software : (render.software || []),
            techniques: (auto.techniques && auto.techniques.length > 0) ? auto.techniques : (render.techniques || []),
            year: auto.year ?? render.year,
            bgColor: auto.bgColor ?? render.bgColor,
        };
    });
};

let renders = initializeRenders();

export default function Renders3DGalleryPage() {
    const { t } = useLanguage();
    useAnalytics('Renders 3D', 'portfolio');
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [validRenders, setValidRenders] = useState(renders);
    const [loadedImages, setLoadedImages] = useState(new Set());
    const [filters, setFilters] = useState({ brightness: 100, contrast: 100, saturation: 100, blur: 0 });

    // Validate images on mount
    useEffect(() => {
        const validateImages = async () => {
            const valid = [];
            const loaded = new Set();

            for (const render of renders) {
                try {
                    const response = await fetch(render.image, { method: "HEAD" });
                    const contentType = response.headers.get("content-type") || "";

                    // Only accept real images; Vite fallback returns HTML with status 200
                    if (response.ok && contentType.startsWith("image")) {
                        valid.push(render);
                        loaded.add(render.image);
                    } else {
                        console.warn(`Imagen no encontrada o tipo incorrecto: ${render.image}`);
                    }
                } catch (error) {
                    console.warn(`Imagen no encontrada: ${render.image}`);
                }
            }

            setValidRenders(valid);
            setLoadedImages(loaded);
        };

        validateImages();
    }, []);

    const displayRenders = validRenders;

    const openLightbox = (index) => setSelectedIndex(index);
    const closeLightbox = () => {
        setSelectedIndex(null);
        setFilters({ brightness: 100, contrast: 100, saturation: 100, blur: 0 });
    };
    const nextImage = () => {
        setSelectedIndex((selectedIndex + 1) % displayRenders.length);
    };
    const prevImage = () => {
        setSelectedIndex((selectedIndex - 1 + displayRenders.length) % displayRenders.length);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-black text-white py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#00e9fa]">
                            {t('render_3d_gallery_title') || 'Galería de Renders 3D'}
                        </h1>
                        <p className="text-gray-400 text-lg">
                            {t('render_3d_gallery_subtitle') || 'Modelado y animación avanzada'}
                        </p>
                    </div>

                    {/* Gallery Grid */}
                    {displayRenders.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayRenders.map((render, index) => (
                                <div
                                    key={render.id}
                                    onClick={() => openLightbox(index)}
                                    className={`group relative h-80 overflow-hidden rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 ${render.bgColor === 'black' ? 'bg-black' : 'bg-white'}`}
                                >
                                    <img
                                        src={render.image}
                                        alt={render.title}
                                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                        style={{ transform: 'translateY(60px) scale(2.5)' }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />

                                    {/* Simple overlay with title only */}
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <h3 className="text-white font-bold text-xl text-center px-4">{render.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-gray-400 text-lg">Cargando galería de renders...</p>
                        </div>
                    )}
                </div>

                {/* Lightbox */}
                {selectedIndex !== null && displayRenders.length > 0 && (
                    <div
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                        onClick={closeLightbox}
                    >
                        {/* Close Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closeLightbox();
                            }}
                            className="absolute top-6 right-6 bg-black/80 text-white hover:bg-[#00e9fa] hover:text-black transition-colors rounded-full p-2"
                            style={{ zIndex: 9999 }}
                            aria-label="Cerrar"
                            type="button"
                        >
                            <X size={32} />
                        </button>

                        {/* Image Container - Click stops propagation */}
                        <div
                            className={`relative flex items-center justify-center ${displayRenders[selectedIndex].bgColor === 'black' ? 'bg-black' : 'bg-white'}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: '95vw', height: '95vh' }}
                        >
                            <img
                                src={displayRenders[selectedIndex].image}
                                alt={displayRenders[selectedIndex].title}
                                className="w-full h-full object-contain"
                                style={{
                                    transform: 'translateY(10%) scale(1.5)',
                                    filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px)`
                                }}
                            />

                            {/* Navigation Buttons */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#00e9fa] transition-colors z-52"
                                aria-label="Anterior"
                                type="button"
                            >
                                <ChevronLeft size={48} />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#00e9fa] transition-colors z-52"
                                aria-label="Siguiente"
                                type="button"
                            >
                                <ChevronRight size={48} />
                            </button>

                            {/* Counter */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm pointer-events-none">
                                {selectedIndex + 1} / {displayRenders.length}
                            </div>

                            {/* Filter Controls - Top Right */}
                            <div className="absolute top-20 right-4 bg-black/80 rounded-lg p-4 space-y-3 pointer-events-auto" style={{ zIndex: 9998, width: '200px' }}>
                                <div className="text-xs text-[#00e9fa] font-bold mb-3">Filtros</div>

                                <div>
                                    <label className="text-xs text-gray-300 block mb-1">Brillo: {filters.brightness}%</label>
                                    <input
                                        type="range"
                                        min="50"
                                        max="150"
                                        value={filters.brightness}
                                        onChange={(e) => setFilters({ ...filters, brightness: parseInt(e.target.value) })}
                                        className="w-full h-1 bg-gray-600 rounded cursor-pointer"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-300 block mb-1">Contraste: {filters.contrast}%</label>
                                    <input
                                        type="range"
                                        min="50"
                                        max="150"
                                        value={filters.contrast}
                                        onChange={(e) => setFilters({ ...filters, contrast: parseInt(e.target.value) })}
                                        className="w-full h-1 bg-gray-600 rounded cursor-pointer"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-300 block mb-1">Saturación: {filters.saturation}%</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={filters.saturation}
                                        onChange={(e) => setFilters({ ...filters, saturation: parseInt(e.target.value) })}
                                        className="w-full h-1 bg-gray-600 rounded cursor-pointer"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-300 block mb-1">Blur: {filters.blur}px</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10"
                                        value={filters.blur}
                                        onChange={(e) => setFilters({ ...filters, blur: parseInt(e.target.value) })}
                                        className="w-full h-1 bg-gray-600 rounded cursor-pointer"
                                    />
                                </div>

                                <button
                                    onClick={() => setFilters({ brightness: 100, contrast: 100, saturation: 100, blur: 0 })}
                                    className="w-full text-xs bg-[#00e9fa] text-black rounded px-2 py-1 hover:bg-[#00d9ea] transition-colors mt-2"
                                >
                                    Reiniciar
                                </button>
                            </div>

                            {/* Metadata Info Panel - Full Width Bottom */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/90 text-white px-8 py-6 pointer-events-none" style={{ zIndex: 10 }}>
                                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                                    {/* Left side: Title and description */}
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold mb-2">{displayRenders[selectedIndex].title}</h3>
                                        <p className="text-sm text-gray-300 mb-3">{displayRenders[selectedIndex].description}</p>
                                    </div>

                                    {/* Right side: Software, Techniques and Year */}
                                    <div className="flex flex-col md:flex-row gap-6 md:items-end">
                                        {/* Software */}
                                        <div>
                                            <p className="text-xs text-[#00e9fa] mb-2">Software:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {displayRenders[selectedIndex].software.map((soft, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 text-xs rounded bg-[#00e9fa]/20 text-[#00e9fa] border border-[#00e9fa]/30"
                                                    >
                                                        {soft}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Techniques */}
                                        <div>
                                            <p className="text-xs text-[#00e9fa] mb-2">Técnicas:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {displayRenders[selectedIndex].techniques.map((tech, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 text-xs rounded bg-white/10 text-white"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Year */}
                                        <div className="text-xs text-gray-400 pb-1">
                                            {displayRenders[selectedIndex].year}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
