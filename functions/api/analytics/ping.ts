export interface Env {}

interface PingData {
	sessionId: string;
	pageTitle: string;
	duration: number;
	timestamp: string;
}

async function storeAnalytics(env: Env, data: PingData, type: string) {
	console.log(`[ANALYTICS:${type.toUpperCase()}]`, JSON.stringify(data));
	return true;
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
	try {
		const data: PingData = await context.request.json();
		await storeAnalytics(context.env, data, 'ping');
		return Response.json({ success: true });
	} catch (error) {
		console.error('Analytics ping error:', error);
		return Response.json({ success: false, error: 'Internal error' }, { status: 500 });
	}
}