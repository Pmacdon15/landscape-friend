import { z } from 'zod'

export const AddClientFormSchema = z.object({
	full_name: z.string().min(1, { message: 'Full name is required' }),
	phone_number: z
		.preprocess(
			(val) => (val === '' ? null : val),
			z.coerce.number().nullable().optional(),
		)
		.refine((val) => val === null || !Number.isNaN(val), {
			message: 'Invalid phone number',
		}),
	email_address: z
		.string()
		.refine(
			(email) =>
				!email ||
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
			{
				message: 'Invalid email address',
			},
		)
		.nullable()
		.optional(),
	address: z.string().min(1, { message: 'Address is required' }),
})

// export type AddClientFormValues = z.infer<typeof AddClientFormSchema>
