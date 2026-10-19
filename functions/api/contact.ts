export interface Env {
	// Add your email service credentials as secrets in Cloudflare Pages dashboard
	// EMAIL_API_KEY: string;
	// EMAIL_FROM: string;
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

		// TODO: Integrate with your email service (SendGrid, Mailgun, Resend, etc.)
		// Example with fetch to email API:
		/*
		const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${context.env.EMAIL_API_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				personalizations: [{
					to: [{ email: 'xlerionultimate@gmail.com' }],
					subject: `Nueva solicitud PoC: ${ticketId} - ${formData.company}`,
					dynamic_template_data: {
						ticketId,
						name: formData.name,
						company: formData.company,
						email: formData.email,
						role: formData.role,
						sector: formData.sector,
						interest: formData.interest,
						challenge: formData.challenge,
					},
				}],
				from: { email: context.env.EMAIL_FROM || 'noreply@xlerion.com' },
			}),
		});

		if (!emailResponse.ok) {
			throw new Error('Failed to send email');
		}
		*/

		// For now, log to console (visible in Cloudflare Workers logs)
		console.log('=== NUEVA SOLICITUD PoC ===');
		console.log(`Ticket: ${ticketId}`);
		console.log(`Nombre: ${formData.name}`);
		console.log(`Empresa: ${formData.company}`);
		console.log(`Email: ${formData.email}`);
		console.log(`Cargo: ${formData.role}`);
		console.log(`Sector: ${formData.sector}`);
		console.log(`Interés: ${formData.interest}`);
		console.log(`Desafío: ${formData.challenge}`);
		console.log('============================');

		// Return success
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