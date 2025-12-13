'use server'
import { Resend } from 'resend'
import type z from 'zod'
import { EmailTemplate } from '@/components/ui/email-templates/contact-email'
import { formSchema } from '../zod/schemas'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(values: z.infer<typeof formSchema>) {
	const validatedFields = formSchema.safeParse({
		full_name: values.full_name,
		email: values.email,
		message: values.message,
	})

	if (!validatedFields.success) {
		return { error: `Error sending email: invalid form` }
	}

	try {
		const { data, error } = await resend.emails.send({
			from: 'Contact Form <contact-form@notifications.landscapefriend.com>',
			to: ['support@landscapefriend.com'],
			subject: 'Contact Form Filled Out',
			react: EmailTemplate({
				name: validatedFields.data.full_name,
				email: validatedFields.data.email,
				message: validatedFields.data.message,
			}),
			replyTo: validatedFields.data.email,
		})

		console.log('Reach Out Form Result: ', data)

		if (error) {
			console.error('Error ', error)
			return { error: `Error sending email: ${JSON.stringify(error)}` }
		}
		return data
	} catch (e: unknown) {
		console.error('Error: ', e)
	}
}
