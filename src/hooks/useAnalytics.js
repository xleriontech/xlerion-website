import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook personalizado para rastrear análitica de páginas
 * Envía: página visitada, tiempo en página, IP, dispositivo, idioma
 */
export const useAnalytics = (pageTitle, pageType = 'page') => {
    const startTimeRef = useRef(null);
    const sessionIdRef = useRef(null);
    const hasReportedRef = useRef(false);

    // Initialize start time on mount
    if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
    }

    // Generar session ID único (o recuperarlo del localStorage)
    useEffect(() => {
        let sessionId = localStorage.getItem('xlerion_session_id');
        if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('xlerion_session_id', sessionId);
        }
        sessionIdRef.current = sessionId;
    }, []);

    // Función para enviar datos a backend
    const trackPageView = useCallback(async (timeSpent = null) => {
        if (hasReportedRef.current) return;
        hasReportedRef.current = true;

        const endTime = Date.now();
        const duration = timeSpent || (endTime - startTimeRef.current);

        const analyticsData = {
            sessionId: sessionIdRef.current,
            pageTitle: pageTitle,
            pageType: pageType,
            timeSpent: duration, // en milisegundos
            userAgent: navigator.userAgent,
            language: navigator.language,
            timestamp: new Date().toISOString(),
            referrer: document.referrer,
            screenResolution: `${window.innerWidth}x${window.innerHeight}`,
            url: window.location.href,
            hostname: window.location.hostname
        };

        try {
            const response = await fetch('/api/analytics.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(analyticsData)
            });

            if (!response.ok) {
                console.warn('Analytics tracking failed:', response.statusText);
            }
        } catch (error) {
            console.warn('Analytics error:', error);
        }
    }, [pageTitle, pageType]);

    // Rastrear salida de página
    useEffect(() => {
        return () => {
            trackPageView();
        };
    }, [trackPageView]);

    // También enviar datos cada 30 segundos (para páginas largas)
    useEffect(() => {
        const interval = setInterval(() => {
            const duration = Date.now() - startTimeRef.current;
            // Enviar ping sin cerrar la sesión
            fetch('/api/analytics-ping.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: sessionIdRef.current,
                    pageTitle: pageTitle,
                    duration: duration,
                    timestamp: new Date().toISOString()
                })
            }).catch(err => console.warn('Ping error:', err));
        }, 30000);

        return () => clearInterval(interval);
    }, [pageTitle]);

    return {
        sessionId: sessionIdRef.current,
        trackEvent: (eventName, eventData = {}) => {
            fetch('/api/analytics-event.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: sessionIdRef.current,
                    eventName: eventName,
                    eventData: eventData,
                    pageTitle: pageTitle,
                    timestamp: new Date().toISOString()
                })
            }).catch(err => console.warn('Event tracking error:', err));
        }
    };
};
