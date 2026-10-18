import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function VideoIntro({ onComplete }) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [canSkip, setCanSkip] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const videoRef = useRef(null);

    useEffect(() => {
        // Permitir saltar después de 2 segundos
        const skipTimer = setTimeout(() => {
            setCanSkip(true);
        }, 2000);

        return () => clearTimeout(skipTimer);
    }, []);

    const handleVideoEnd = () => {
        setIsPlaying(false);
        onComplete();
    };

    const handleSkip = () => {
        if (canSkip) {
            setIsPlaying(false);
            onComplete();
        }
    };

    const handleKeyPress = useCallback((e) => {
        if (canSkip && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) {
            handleSkip();
        }
    }, [canSkip]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => {
            const percent = video.duration ? (video.currentTime / video.duration) * 100 : 0;
            setProgressPercent(percent);
        };

        video.addEventListener('timeupdate', updateProgress);
        return () => video.removeEventListener('timeupdate', updateProgress);
    }, []);

    if (!isPlaying) return null;

    // During local development the intro overlay can block the nav and links.
    // Use a lower z-index on localhost/127.0.0.1 so dev navigation remains clickable.
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
    const zClass = isLocal ? 'z-40' : 'z-[9999]';

    return (
        <div className={`fixed inset-0 ${zClass} bg-black flex items-center justify-center`}>
            <video
                ref={videoRef}
                className="w-full h-full object-contain"
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
            >
                <source src="/videos/xlerionIntro.mp4" type="video/mp4" />
            </video>

            {/* Botón Skip - Optimizado para móviles */}
            {canSkip && (
                <button
                    onClick={handleSkip}
                    className="absolute bottom-4 right-4 md:bottom-8 md:right-8 px-4 py-2 md:px-6 md:py-3 bg-[#00e9fa]/20 hover:bg-[#00e9fa]/40 active:bg-[#00e9fa]/60 border border-[#00e9fa] text-[#00e9fa] font-mono text-xs md:text-sm uppercase tracking-wider transition-all duration-300 rounded-sm backdrop-blur-sm touch-manipulation"
                    aria-label="Saltar introducción"
                >
                    <span className="hidden sm:inline">Saltar Intro</span>
                    <span className="sm:hidden">Saltar</span>
                </button>
            )}

            {/* Indicador de progreso */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div
                    className="h-full bg-[#00e9fa] transition-all duration-100"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>
    );
}
