export interface Env {}

interface EventData {
	sessionId: string;
	eventName: string;
	eventData: Record<string, unknown>;
	pageTitle: string;
	timestamp: string;
}

async function storeAnalytics(env: Env, data: EventData, type: string) {
	console.log(`[ANALYTICS:${type.toUpperCase()}]`, JSON.stringify(data));
	return true;
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
	try {
		const data: EventData = await context.request.json();
		await storeAnalytics(context.env, data, 'event');
		return Response.json({ success: true });
	} catch (error) {
		console.error('Analytics event error:', error);
		return Response.json({ success: false, error: 'Internal error' }, { status: 500 });
	}
}