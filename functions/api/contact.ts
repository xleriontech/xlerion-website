export interface Env {
	RESEND_API_KEY: string;
	EMAIL_FROM: string;
	EMAIL_TO: string;
}

interface ContactFormData {
	name: string;
	company: string;
	email: string;
	role: string;
	sector: string;
	interest: string;
	challenge: string;
	consent: boolean;
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
	try {
		const formData: ContactFormData = await context.request.json();

		// Validate required fields
		if (!formData.name || !formData.company || !formData.email || !formData.challenge || !formData.consent) {
			return Response.json(
				{ success: false, error: 'Faltan campos requeridos' },
				{ status: 400 }
			);
		}

		// Generate ticket ID
		const ticketId = `POC-XLERION-${Math.floor(1000 + Math.random() * 9000)}`;

		// Send email via Resend API (fetch native, no dependencies)
		const emailResponse = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				from: context.env.EMAIL_FROM,
				to: [context.env.EMAIL_TO],
				subject: `Nueva solicitud PoC: ${ticketId} - ${formData.company}`,
				html: `
					<h2>Nueva solicitud de Prueba de Concepto</h2>
					<p><strong>Ticket:</strong> ${ticketId}</p>
					<p><strong>Nombre:</strong> ${formData.name}</p>
					<p><strong>Empresa:</strong> ${formData.company}</p>
					<p><strong>Email:</strong> ${formData.email}</p>
					<p><strong>Cargo:</strong> ${formData.role || 'No especificado'}</p>
					<p><strong>Sector:</strong> ${formData.sector}</p>
					<p><strong>Interés:</strong> ${formData.interest}</p>
					<p><strong>Desafío:</strong></p>
					<p>${formData.challenge.replace(/\n/g, '<br>')}</p>
				`,
				reply_to: formData.email,
			}),
		});

		const emailResult = await emailResponse.json();

		if (!emailResponse.ok) {
			console.error('Resend error:', emailResult);
			throw new Error(emailResult.message || 'Failed to send email');
		}

		console.log('=== NUEVA SOLICITUD PoC ===');
		console.log(`Ticket: ${ticketId}`);
		console.log(`Resend ID: ${emailResult.id}`);
		console.log(`Nombre: ${formData.name}`);
		console.log(`Empresa: ${formData.company}`);
		console.log(`Email: ${formData.email}`);
		console.log(`Cargo: ${formData.role}`);
		console.log(`Sector: ${formData.sector}`);
		console.log(`Interés: ${formData.interest}`);
		console.log(`Desafío: ${formData.challenge}`);
		console.log('============================');

		return Response.json({
			success: true,
			ticketId,
			message: 'Solicitud registrada. Le contactaremos en < 24h hábiles.',
		});
	} catch (error) {
		console.error('Contact form error:', error);
		return Response.json(
			{ success: false, error: 'Error interno del servidor' },
			{ status: 500 }
		);
	}
}