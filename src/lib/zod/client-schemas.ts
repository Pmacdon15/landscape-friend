import { z } from 'zod'

export const AddClientFormSchema = z.object({
	full_name: z.string().min(1, { message: 'Full name is required' }),
	phone_number: z
		.string()
		.refine((phoneNumber) => /^\d{10}$/.test(phoneNumber), {
			message:
				'Invalid phone number format. Please use 10 digits, e.g., 1234567890',
		}),
	email_address: z.email({ message: 'Invalid email address' }),
	address: z.string().min(1, { message: 'Address is required' }),
})

export type AddClientFormValues = z.infer<typeof AddClientFormSchema>
