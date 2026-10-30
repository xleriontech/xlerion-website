// WebSocket client for real-time telemetry
// Connects to xlerion.com WebSocket endpoint for live metrics

const WS_BASE_URL = import.meta.env.VITE_XLERION_WS_URL || 'wss://xlerion.com/ws';

/**
 * Connect to telemetry WebSocket
 * @param {string} token - Bearer JWT token
 * @param {Function} onMessage - Callback for incoming messages
 * @returns {WebSocket} WebSocket instance
 */
export function connectTelemetry(token, onMessage) {
    const ws = new WebSocket(`${WS_BASE_URL}/telemetry?token=${token}`);

    ws.onopen = () => {
        console.log('[Telemetry] Connected to WebSocket');

        // Send initial subscription message
        ws.send(JSON.stringify({
            type: 'subscribe',
            channels: ['inference-metrics', 'system-health', 'queue-status']
        }));
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);

            // Filter and transform telemetry data
            const telemetry = {
                timestamp: data.timestamp || Date.now(),
                queueSize: data.queueSize || 0,
                rate: data.throughput || '0',
                latency: data.avgLatency || 0,
                cpuLoad: data.cpuUsage ? `${data.cpuUsage}%` : '0%',
                throughput: data.throughput ? `${data.throughput} img/s` : '0 img/s',
                activeJobs: data.activeJobs || 0,
                completedJobs: data.completedJobs || 0
            };

            onMessage(telemetry);
        } catch (err) {
            console.error('[Telemetry] Parse error:', err);
        }
    };

    ws.onerror = (error) => {
        console.error('[Telemetry] WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('[Telemetry] WebSocket closed');
    };

    return ws;
}

/**
 * Create mock telemetry for local demo mode
 * @param {Function} onMessage - Callback for synthetic data
 * @returns {Object} Mock connection object with close method
 */
export function createMockTelemetry(onMessage) {
    let interval;
    let active = true;

    const generateMockData = () => {
        if (!active) return;

        const telemetry = {
            timestamp: Date.now(),
            queueSize: Math.floor(Math.random() * 5),
            rate: (Math.random() * 2 + 0.5).toFixed(1),
            latency: Math.floor(Math.random() * 100 + 150),
            cpuLoad: `${Math.floor(Math.random() * 30 + 10)}%`,
            throughput: `${(Math.random() * 2 + 0.5).toFixed(1)} img/s`,
            activeJobs: Math.floor(Math.random() * 3),
            completedJobs: Math.floor(Math.random() * 100)
        };

        onMessage(telemetry);
    };

    // Generate initial data
    generateMockData();

    // Update every 2 seconds
    interval = setInterval(generateMockData, 2000);

    return {
        close: () => {
            active = false;
            if (interval) clearInterval(interval);
        }
    };
}
