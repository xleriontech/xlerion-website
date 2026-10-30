export interface Env {
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

async function storeAnalytics(env: Env, data: AnalyticsData, type: string) {
	console.log(`[ANALYTICS:${type.toUpperCase()}]`, JSON.stringify(data));
	return true;
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
	try {
		const data: AnalyticsData = await context.request.json();
		await storeAnalytics(context.env, data, 'pageview');
		return Response.json({ success: true });
	} catch (error) {
		console.error('Analytics error:', error);
		return Response.json({ success: false, error: 'Internal error' }, { status: 500 });
	}
}