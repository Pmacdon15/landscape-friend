import z from 'zod'

export const schemaAddClient = z.object({
	full_name: z.string(),
	phone_number: z.string().optional().nullable(),
	email_address: z.string().optional().nullable(),
	addresses: z.array(z.object({ address: z.string() })),
	stripe_customer_id: z.string().optional().nullable(),
	organization_id: z.string(),
})

export const schemaUpdatePricePerMonth = z.object({
	clientId: z.number(),
	pricePerMonthGrass: z.number().optional(),
	pricePerMonthSnow: z.number().optional(),
	snow: z.boolean(),
})

export const schemaDeleteClient = z.object({
	client_id: z.number(),
})

export const schemaDeleteSiteMap = z.object({
	siteMap_id: z.number(),
})

export const schemaSendEmail = z.object({
	title: z.string(),
	message: z.string(),
	sender: z.email(),
	senderName: z.string(),
	replyTo: z.email().optional(),
})

export const schemaUpdateCuttingDay = z.object({
	addressId: z.number(),
	cuttingWeek: z.number(),
	updatedDay: z.string(),
})

export const schemaMarkYardCut = z.object({
	addressId: z.number(),
	date: z.date(),
})

export const schemaAssign = z.object({
	addressId: z.number(),
	assignedTo: z.string(),
})

export const schemaAssignSnow = z.object({
	// clientId: z.number(),
	assignedTo: z.string(),
	addressId: z.number(),
})

export const schemaUpdateAPI = z.object({
	APIKey: z.string(),
})

export const materialSchema = z.object({
	materialType: z.string().optional().or(z.literal('')),
	materialCostPerUnit: z.number(),
	materialUnits: z.number(),
})

export const schemaCreateQuote = z.object({
	clientName: z.string().min(3).max(25),
	clientEmail: z
		.string()
		.refine(
			(email) =>
				!email ||
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
			{
				message: 'Invalid email address',
			},
		),
	// .nullable()
	// .optional(),
	phone_number: z.string().min(7, 'Phone number is required'),
	addresses: z.array(z.string()).min(1, 'At least one address is required'),
	description: z.string().optional(),
	labourCostPerUnit: z.number(),
	labourUnits: z.number(),
	materials: z.array(materialSchema),
	organization_id: z.string(),
})

export const lineItemSchema = z.object({
	description: z.string(),
	amount: z.coerce.number().min(0, 'Amount must be a non-negative number'),
	quantity: z.coerce
		.number()
		.min(0, 'Quantity must be a non-negative number'),
})

export const schemaUpdateInvoice = z.object({
	invoiceId: z.string(),
	lines: z.array(lineItemSchema),
	organization_id: z.string().nullable().optional(),
})

export const AddClientSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.email('Invalid email address'),
	address: z.string().min(1, 'Address is required'),
	notes: z.string().optional(),
	lat: z.number().optional(),
	lng: z.number().optional(),
})
export const MAX_FILE_SIZE = 5 * 1024 * 1024
export const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
]

export const ImageSchema = z.object({
	image: z
		.instanceof(File)
		.refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
			'Only .jpg, .jpeg, .png and .webp formats are supported.',
		),
})

export const schemaUpdateStatement = z.object({
	id: z.string(),
	lines: z.array(
		z.object({
			description: z.string().optional(),
			amount: z.number(),
			quantity: z.number(),
		}),
	),
})

export const schemaCreateSubscription = z.object({
	clientName: z.string().min(1, 'Client name is required'),
	clientEmail: z.email('Invalid email address'),
	phone_number: z.string().min(7, 'Phone number is required'),
	addresses: z.array(z.string()).min(1, 'At least one address is required'),
	addressPricing: z
		.array(
			z.object({
				address: z.string(),
				price: z.number().min(0.01, 'Price must be positive'),
			}),
		)
		.min(1, 'At least one address with pricing is required'),
	description: z.string().optional(),
	serviceType: z.enum(['snow-unlimited', 'weekly-grass-cutting', 'bi-weekly-grass-cutting', 'monthly-grass-cutting'], {
		message: 'Please select a valid service type',
	}),
	startDate: z.coerce.date({ message: 'Start date is required' }),
	endDate: z.coerce.date({ message: 'End date is required' }),
	organization_id: z.string(),
	collectionMethod: z
		.enum(['charge_automatically', 'send_invoice'])
		.default('send_invoice')
		.optional(),
})

export const formSchema = z.object({
	full_name: z
		.string()
		.min(3, 'Full Name must be at least 3 characters.')
		.max(25, 'Full Name must be at most 25 characters.'),
	email: z
		.email('Enter your email')
		.min(3, 'Email must be at least 3 characters.')
		.max(50, 'Email must be at most 50 characters.'),
	message: z
		.string()
		.min(20, 'Message must be at least 20 characters.')
		.max(200, 'Message must be at most 200 characters.'),
})
