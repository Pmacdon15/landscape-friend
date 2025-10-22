'use server'

import { inngest } from '../inngest/inngest'

export async function summarizeText(formData: FormData) {
	// Extract text and user email from the form data
	const text = formData.get('text') as string
	const userEmail = formData.get('userEmail') as string | null

	// Trigger the Inngest workflow
	await inngest.send({
		name: 'text/summary.requested',
		data: {
			text,
			userEmail,
		},
	})
}
