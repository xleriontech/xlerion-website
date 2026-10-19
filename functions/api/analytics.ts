export interface Env {
	// Add your database/analytics service credentials here if needed
	// ANALYTICS_DB: D1Database;
}

interface AnalyticsData {
	sessionId: string;
	pageTitle: string;
	pageType: string;
	timeSpent: number;
	userAgent: string;
	language: string;
	timestamp: string;
	referrer: string;
	screenResolution: string;
	url: string;
	hostname: string;
}

interface PingData {
	sessionId: string;
	pageTitle: string;
	duration: number;
	timestamp: string;
}

interface EventData {
	sessionId: string;
	eventName: string;
	eventData: Record<string, unknown>;
	pageTitle: string;
	timestamp: string;
}

interface VisitorCountData {
	unique_visitors: number;
	total_views: number;
	today_visitors: number;
}

// Helper to store analytics (replace with your preferred storage: D1, KV, external API, etc.)
async function storeAnalytics(env: Env, data: AnalyticsData | PingData | EventData, type: 'pageview' | 'ping' | 'event') {
	// Option 1: Log to console (visible in Cloudflare Workers logs)
	console.log(`[ANALYTICS:${type.toUpperCase()}]`, JSON.stringify(data));

	// Option 2: Store in Cloudflare D1 (uncomment and bind in wrangler.jsonc)
	/*
	if (env.ANALYTICS_DB) {
		await env.ANALYTICS_DB.prepare(
			`INSERT INTO analytics (type, session_id, page_title, page_type, time_spent, user_agent, language, timestamp, referrer, screen_resolution, url, hostname, event_name, event_data)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		).bind(
			type,
			data.sessionId,
			'pageTitle' in data ? data.pageTitle : null,
			'pageType' in data ? data.pageType : null,
			'timeSpent' in data ? data.timeSpent : ('duration' in data ? data.duration : null),
			'userAgent' in data ? data.userAgent : null,
			'language' in data ? data.language : null,
			data.timestamp,
			'referrer' in data ? data.referrer : null,
			'screenResolution' in data ? data.screenResolution : null,
			'url' in data ? data.url : null,
			'hostname' in data ? data.hostname : null,
			'eventName' in data ? data.eventName : null,
			'eventData' in data ? JSON.stringify(data.eventData) : null
		).run();
	}
	*/

	// Option 3: Forward to external analytics (GA4, Mixpanel, PostHog, etc.)
	/*
	await fetch('https://your-analytics-endpoint.com/collect', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ...data, type }),
	});
	*/

	return true;
}

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
	try {
		const url = new URL(context.request.url);
		const pathname = url.pathname;

		const isVisitorCount = pathname === '/api/analytics-visitor-count' || pathname.endsWith('/api/analytics-visitor-count');

		if (isVisitorCount) {
			// Return mock data for now (replace with real analytics storage)
			// In production, query your D1/KV/external analytics
			const data: VisitorCountData = {
				unique_visitors: 1247,
				total_views: 3891,
				today_visitors: 23,
			};
			return Response.json({ success: true, data });
		}

		return Response.json({ error: 'Not found' }, { status: 404 });
	} catch (error) {
		console.error('Analytics GET error:', error);
		return Response.json({ success: false, error: 'Internal error' }, { status: 500 });
	}
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
	try {
		const url = new URL(context.request.url);
		const pathname = url.pathname;

		// Handle both /api/analytics* and /analytics* paths
		const isAnalytics = pathname === '/api/analytics' || pathname.endsWith('/api/analytics');
		const isPing = pathname === '/api/analytics-ping' || pathname.endsWith('/api/analytics-ping');
		const isEvent = pathname === '/api/analytics-event' || pathname.endsWith('/api/analytics-event');

		if (isAnalytics) {
			// Page view tracking
			const data: AnalyticsData = await context.request.json();
			await storeAnalytics(context.env, data, 'pageview');
			return Response.json({ success: true });
		}

		if (isPing) {
			// Periodic ping
			const data: PingData = await context.request.json();
			await storeAnalytics(context.env, data, 'ping');
			return Response.json({ success: true });
		}

		if (isEvent) {
			// Custom event tracking
			const data: EventData = await context.request.json();
			await storeAnalytics(context.env, data, 'event');
			return Response.json({ success: true });
		}

		return Response.json({ error: 'Not found' }, { status: 404 });
	} catch (error) {
		console.error('Analytics error:', error);
		return Response.json({ success: false, error: 'Internal error' }, { status: 500 });
	}
}