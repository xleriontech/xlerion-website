/**
 * Analytics Tracker - Para páginas estáticas HTML (Total Darkness, Redemthor, etc)
 * Rastrea: página visitada, tiempo en página, IP, dispositivo, idioma, resolución
 * 
 * USO: Agregar al final del HTML antes de </body>:
 * <script src="/js/analytics-tracker.js"></script>
 * <script>
 *   initAnalytics('Nombre de Página', 'tipo_pagina');
 * </script>
 */

(function () {
    window.analyticsTracker = {
        startTime: Date.now(),
        sessionId: null,
        pageTitle: '',
        pageType: '',
        pingInterval: null,

        /**
         * Obtener o generar session ID
         */
        getSessionId() {
            let sessionId = localStorage.getItem('xlerion_session_id');
            if (!sessionId) {
                sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem('xlerion_session_id', sessionId);
            }
            return sessionId;
        },

        /**
         * Enviar page view (se ejecuta al cargar)
         */
        trackPageView(pageTitle, pageType = 'page') {
            const payload = {
                sessionId: this.sessionId,
                pageTitle: pageTitle,
                pageType: pageType,
                timeSpent: 0, // En el inicial es 0, se actualiza al salir
                userAgent: navigator.userAgent,
                language: navigator.language,
                timestamp: new Date().toISOString(),
                referrer: document.referrer,
                screenResolution: `${window.innerWidth}x${window.innerHeight}`,
                url: window.location.href,
                hostname: window.location.hostname
            };

            fetch('/api/analytics.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(err => console.warn('Analytics POST error:', err));
        },

        /**
         * Enviar ping cada 30 segundos (actividad)
         */
        startPingInterval() {
            this.pingInterval = setInterval(() => {
                const duration = Date.now() - this.startTime;
                const payload = {
                    sessionId: this.sessionId,
                    pageTitle: this.pageTitle,
                    duration: duration,
                    timestamp: new Date().toISOString()
                };

                fetch('/api/analytics-ping.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).catch(err => console.warn('Analytics ping error:', err));
            }, 30000); // Cada 30 segundos
        },

        /**
         * Enviar evento personalizado
         */
        trackEvent(eventName, eventData = {}) {
            const payload = {
                sessionId: this.sessionId,
                eventName: eventName,
                eventData: eventData,
                pageTitle: this.pageTitle,
                timestamp: new Date().toISOString()
            };

            fetch('/api/analytics-event.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(err => console.warn('Analytics event error:', err));
        },

        /**
         * Registrar tiempo al abandonar página
         */
        trackPageExit() {
            const duration = Date.now() - this.startTime;
            const payload = {
                sessionId: this.sessionId,
                pageTitle: this.pageTitle,
                pageType: this.pageType,
                timeSpent: duration,
                userAgent: navigator.userAgent,
                language: navigator.language,
                timestamp: new Date().toISOString(),
                referrer: document.referrer,
                screenResolution: `${window.innerWidth}x${window.innerHeight}`,
                url: window.location.href,
                hostname: window.location.hostname,
                exitTime: true
            };

            // Usar sendBeacon para asegurar entrega incluso si la página se cierra
            if (navigator.sendBeacon) {
                navigator.sendBeacon('/api/analytics.php', JSON.stringify(payload));
            } else {
                fetch('/api/analytics.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    keepalive: true
                }).catch(err => console.warn('Analytics exit error:', err));
            }

            // Limpiar intervalo
            if (this.pingInterval) {
                clearInterval(this.pingInterval);
            }
        },

        /**
         * Inicializar tracker (FUNCIÓN PRINCIPAL)
         */
        init(pageTitle, pageType = 'page') {
            this.sessionId = this.getSessionId();
            this.pageTitle = pageTitle;
            this.pageType = pageType;

            // Enviar page view inicial
            this.trackPageView(pageTitle, pageType);

            // Iniciar pings
            this.startPingInterval();

            // Registrar salida
            window.addEventListener('beforeunload', () => this.trackPageExit());
            window.addEventListener('pagehide', () => this.trackPageExit());

            console.log(`✓ Analytics inicializado: ${pageTitle} (${pageType})`);
        }
    };

    /**
     * Función global para inicializar analytics
     * USAR: initAnalytics('Nombre Página', 'tipo')
     */
    window.initAnalytics = function (pageTitle, pageType = 'page') {
        window.analyticsTracker.init(pageTitle, pageType);
    };

})();
