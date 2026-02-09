import type { JwtPayload } from '@clerk/types'
import Stripe from 'stripe'
import type z from 'zod'
import {
	getClientByIdDb,
	updateClientInfoDb,
	updateClientStripeIdByIdDb,
	updateStripeCustomerIdDb,
} from '@/lib/DB/clients-db'
import {
	deleteWebhookIdDb,
	fetchStripAPIKeyDb,
	fetchWebhookIdDb,
	storeWebhookInfoDb,
} from '@/lib/DB/stripe-db'
import { sendEmailWithTemplate } from '../actions/sendEmails-action'
import { fetchClientNamesByStripeIds } from '../dal/clients-dal'
import { getStripeInstance } from '../dal/stripe-dal'
import type { schemaCreateSubscription } from '../zod/schemas'
import { formatCompanyName } from './resend'

let stripe: Stripe | null = null

export async function getStripeInstanceUnprotected(
	orgId: string,
): Promise<Stripe | null> {
	const apiKeyResponse = await fetchStripAPIKeyDb(orgId)
	if (apiKeyResponse instanceof Error) {
		return null
	}

	if (!apiKeyResponse) {
		return null
	}

	const apiKey = apiKeyResponse.api_key
	if (!apiKey) {
		return null
	}

	stripe = new Stripe(apiKey, {
		// apiVersion: '2025-08-27.basil',
	})
	return stripe
}

export async function findOrCreateStripeCustomer(
	clientName: string,
	clientEmail: string | null | undefined,
	// _phoneNumber: string | null | undefined,
	// _address: string,
	organization_id: string,
	clientId?: number,
): Promise<string | null | { error: string }> {
	const stripe = await getStripeInstance()

	if (!stripe) {
		return null
	}

	let customerId: string
	if (!clientEmail)
		return { error: 'No client Email unable to create stripe customer' }

	const existingCustomers = await stripe.customers.list({
		email: clientEmail,
		limit: 100,
	})

	const existingCustomer = existingCustomers.data.find(
		(customer) => customer.name === clientName,
	)

	if (existingCustomer) {
		customerId = existingCustomer.id
	} else {
		console.log('No existing Stripe customer found, creating new one.')
		try {
			const newCustomer = await stripe.customers.create({
				name: clientName,
				email: clientEmail,
				metadata: {
					organization_id: organization_id,
				},
			})
			customerId = newCustomer.id

			if (!clientId) return customerId
			if (!(await updateStripeCustomerIdDb(clientId, customerId)))
				throw new Error('Stripe customer Id not stored in DB')
		} catch (error) {
			console.error('Error in creating Stripe customer:', error)
			throw new Error('Error creating strip customer')
		}
	}

	return customerId
}

export async function createOrUpdateStripeUser(
	clientId: number,
	clientName: string,
	clientEmail: string | null | undefined,
	phoneNumber: string | null | undefined,
	addresses: { address: string }[],
	organization_id: string | undefined,
) {
	if (!organization_id) {
		throw new Error('Organization ID is required.')
	}

	const stripe = await getStripeInstanceUnprotected(organization_id)

	if (!stripe) {
		console.log(
			'Stripe is not configured for this organization. Skipping Stripe customer creation/update.',
		)
		// If Stripe is not configured, we still need to update the client info in local DB.
		await updateClientInfoDb(
			clientId,
			clientName,
			clientEmail,
			phoneNumber,
			addresses,
		)
		return
	}

	const currentClient = await getClientByIdDb(clientId)

	if (!currentClient) {
		throw new Error(`Client with id ${clientId} not found.`)
	}

	const stripePhoneNumber = phoneNumber ? String(phoneNumber) : undefined
	const addressMetadata = JSON.stringify(addresses.map((a) => a.address))
	let stripeCustomerId: string

	if (!currentClient.stripe_customer_id) {
		// Create a new Stripe customer
		stripeCustomerId = (
			await stripe.customers.create({
				name: clientName,
				email: clientEmail ?? '',
				phone: stripePhoneNumber,
				address: {
					line1: addresses[0]?.address ?? '',
				},
				metadata: {
					organization_id: organization_id ?? '',
					clientId: clientId,
					addresses: addressMetadata,
				},
			})
		).id

		await updateClientStripeIdByIdDb(clientId, stripeCustomerId)
	} else {
		// Update an existing Stripe customer
		stripeCustomerId = (
			await stripe.customers.update(currentClient.stripe_customer_id, {
				name: clientName,
				email: clientEmail ?? '',
				phone: stripePhoneNumber,
				address: {
					line1: addresses[0]?.address ?? '',
				},
				metadata: {
					organization_id: organization_id ?? '',
					clientId: clientId,
					addresses: addressMetadata,
				},
			})
		).id

		await updateClientInfoDb(
			clientId,
			clientName,
			clientEmail,
			phoneNumber,
			addresses,
		)
	}
}
export async function createStripeWebhook(
	apiKey: string,
	organizationId: string,
): Promise<void> {
	const stripe = new Stripe(apiKey)
	const webhookUrl = `https://www.landscapefriend.com/api/webhooks/stripe/${organizationId}`

	try {
		const webhooks = await stripe.webhookEndpoints.list()
		const existingWebhook = webhooks.data.find(
			(webhook) => webhook.url === webhookUrl,
		)

		if (existingWebhook) {
			await stripe.webhookEndpoints.del(existingWebhook.id)
		}

		const webhook = await stripe.webhookEndpoints.create({
			url: webhookUrl,
			enabled_events: ['invoice.paid', 'invoice.sent'],
		})

		if (webhook.secret) {
			await storeWebhookInfoDb(organizationId, webhook.secret, webhook.id)
		}
	} catch (error) {
		console.error('Error creating Stripe webhook:', error)
		throw error
	}
}

export async function deleteStripeWebhookRoute(orgId: string) {
	try {
		const apiKey = await fetchStripAPIKeyDb(orgId)
		const webhookId = await fetchWebhookIdDb(orgId)

		if (apiKey && webhookId) {
			const stripe = new Stripe(apiKey.api_key)
			await stripe.webhookEndpoints.del(webhookId.webhook_id)
			await deleteWebhookIdDb(orgId)
		}
	} catch (error) {
		console.error('Error deleting Stripe webhook:', error)
		throw error
	}
}

export const createNotificationPayloadQuote = async (
	quote: Stripe.Response<Stripe.Quote>,
	clientName: string,
	encodedClientName: string,
	id?: string,
) => ({
	quote: {
		amount: ((quote.amount_total ?? 0) / 100).toString(),
		id: quote.id || '',
	},
	client: {
		name: clientName,
		encodedClientName: encodedClientName,
	},
	id: id || '',
})

export const createNotificationPayloadInvoice = async (
	invoice: Stripe.Response<Stripe.Invoice>,
	clientName: string,
) => ({
	invoice: {
		amount: ((invoice.total ?? 0) / 100).toString(),
		id: invoice.id || '',
	},
	client: {
		name: clientName,
	},
})

export async function getStripeCustomerByEmail(
	email: string,
): Promise<Stripe.Customer | null> {
	const stripe = await getStripeInstance()
	if (!stripe) return null
	const customers = await stripe.customers.list({ email: email, limit: 1 })
	return customers.data.length > 0 ? customers.data[0] : null
}

export async function createStripeCustomer(customerData: {
	email: string
	name?: string
	address?: { line1: string }
	phone?: string
	metadata?: { [key: string]: string }
}): Promise<Stripe.Customer | null> {
	const stripe = await getStripeInstance()
	if (!stripe) return null
	const customer = await stripe.customers.create(customerData)
	return customer
}
export async function createStripeSubscriptionQuote(
	subscriptionData: z.infer<typeof schemaCreateSubscription>,
	sessionClaims: JwtPayload,
) {
	const {
		clientEmail,
		clientName,
		addresses,
		addressPricing,
		description,
		phone_number,
		serviceType,
		startDate,
		endDate,
		organization_id,
		collectionMethod,
	} = subscriptionData

	if (!endDate) {
		throw new Error('End date is required')
	}

	const stripe = await getStripeInstanceUnprotected(organization_id)
	if (!stripe) throw new Error('No Stripe instance')

	let customer = await getStripeCustomerByEmail(clientEmail)
	if (!customer) {
		customer = await stripe.customers.create({
			email: clientEmail,
			name: clientName,
			address: { line1: addresses[0] },
			phone: phone_number,
			metadata: {
				organization_id,
				serviceType,
				addresses: addresses.join(' | '),
			},
		})
	}

	// Create a product and price for each address
	const lineItems = await Promise.all(
		addressPricing.map(async ({ address, price }) => {
			const productName = `Seasonal Subscription - ${serviceType} for ${address}`

			const product = await stripe.products.create({
				name: productName,
				metadata: { organization_id, serviceType, address },
			})

			const priceObj = await stripe.prices.create({
				unit_amount: Math.round(price * 100),
				currency: 'cad',
				recurring: { interval: 'month' },
				product: product.id,
				metadata: { organization_id, serviceType, address },
			})

			return {
				price: priceObj.id,
				quantity: 1,
			}
		}),
	)

	const startDateUnix = Math.floor(new Date(startDate).getTime() / 1000)
	const quoteParams: Stripe.QuoteCreateParams = {
		customer: customer.id,
		line_items: lineItems,
		description: description,
		collection_method: collectionMethod || 'send_invoice',
		invoice_settings: {
			days_until_due: 10,
		},
		subscription_data: {
			effective_date: startDateUnix,
		},
		metadata: {
			organization_id,
			clientEmail,
			serviceType,
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString(),
			addresses: JSON.stringify(addresses),
			addressPricing: JSON.stringify(addressPricing),
			description: String(subscriptionData.description),
		},
	}
	const quote = await stripe.quotes.create(quoteParams)

	const finalizedQuote = await stripe.quotes.finalizeQuote(quote.id)
	await sendQuote(quote.id, stripe, sessionClaims)
	return finalizedQuote
}

export async function sendQuote(
	quoteId: string,
	stripe: Stripe,
	sessionClaims: JwtPayload,
) {
	try {
		const quote = await stripe.quotes.retrieve(quoteId)
		if (!quote) throw new Error('Quote not found')

		const customerId =
			typeof quote.customer === 'string'
				? quote.customer
				: quote.customer?.id
		if (!customerId) throw new Error('Customer ID not found for quote.')

		const customer = await stripe.customers.retrieve(customerId)
		if (customer.deleted) throw new Error('Customer has been deleted.')

		const customerEmail = customer.email
		const customerName = customer.name || 'Valued Customer'

		if (!customerEmail) throw new Error('Customer email not found.')

		const pdfStream = await stripe.quotes.pdf(quoteId)
		const pdfContent = await streamToBuffer(pdfStream)

		const attachments = [
			{
				filename: `quote_${quoteId}.pdf`,
				content: pdfContent,
			},
		]

		const companyName = formatCompanyName({
			orgName: sessionClaims?.orgName as string,
			userFullName: sessionClaims?.userFullName as string,
		})

		const emailSubject = `Your Quote from ${companyName}`
		const emailBody = `Dear ${customerName},

                            Please find your quote attached and reply to this email to let us know you accept.
                        
                            Thank you for your business!`

		const formDataForEmail = new FormData()
		formDataForEmail.append('title', emailSubject)
		formDataForEmail.append('message', emailBody)

		const emailResult = await sendEmailWithTemplate(
			formDataForEmail,
			customerEmail,
			attachments,
		)

		if (!emailResult) {
			throw new Error('Failed to send quote email.')
		}

		// console.log("Quote re-sent and email sent successfully:", quoteId);
		return { success: true, message: 'Quote sent successfully.' }
	} catch (error) {
		console.error(error)
		throw new Error(
			`Failed to resend quote ${quoteId}: ${error instanceof Error ? error.message : String(error)}`,
		)
	}
}

//MARK: Helper function to convert ReadableStream to Buffer
export async function cancelStripeSubscription(
	subscriptionId: string,
): Promise<void> {
	const stripe = await getStripeInstance()
	if (!stripe) return
	await stripe.subscriptions.cancel(subscriptionId)
}

//MARK: Helper function to convert ReadableStream to Buffer
const streamToBuffer = (stream: NodeJS.ReadableStream): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = []
		stream.on('data', (chunk: Buffer) => chunks.push(chunk))
		stream.on('end', () => resolve(Buffer.concat(chunks)))
		stream.on('error', reject)
	})
}

export async function acceptAndScheduleQuote(
	stripe: Stripe,
	updatedQuote: Stripe.Quote,
) {
	const startDateUnix = updatedQuote.metadata?.startDate
		? Math.floor(new Date(updatedQuote.metadata.startDate).getTime() / 1000)
		: undefined
	const endDateUnix = updatedQuote.metadata?.endDate
		? Math.floor(new Date(updatedQuote.metadata.endDate).getTime() / 1000)
		: undefined

	// Accept the quote — this creates a subscription schedule
	const acceptedQuote = await stripe.quotes.accept(updatedQuote.id)

	const scheduleId = acceptedQuote.subscription_schedule as string
	if (scheduleId && startDateUnix && endDateUnix) {
		const schedule = await stripe.subscriptionSchedules.retrieve(scheduleId)

		// console.log(
		// 	'updatedQuote.invoice_settings.days_until_due: ',
		// 	updatedQuote.invoice_settings.days_until_due,
		// )
		// console.log('schedule: ', schedule)
		// console.log(
		// 	'schedule: ',
		// 	JSON.stringify(schedule.phases[0].invoice_settings),
		// )
		// Update the schedule to enforce an end date
		await stripe.subscriptionSchedules.update(scheduleId, {
			end_behavior: 'cancel',
			phases: [
				{
					invoice_settings: {
						days_until_due:
							schedule.phases[0].invoice_settings
								?.days_until_due || 10,
					},
					start_date: startDateUnix,
					end_date: endDateUnix,
					items: schedule.phases[0].items.map((item) => ({
						price: item.price as string,
						quantity: item.quantity ?? 1,
					})),
				},
			],
		})
	}

	const invoiceId = acceptedQuote.invoice as string | null

	if (invoiceId) {
		// Fetch the full Stripe invoice object
		const invoice = await stripe.invoices.retrieve(invoiceId)
		console.log('Invoice retrieved from Stripe:', invoice)

		return invoice.id
	} else {
		console.log('No invoice created for this quote.')
		return null
	}
}

export async function getQuoteDetailsAndClientName(
	quoteId: string,
	stripe: Stripe,
) {
	const updatedQuote = await stripe.quotes.retrieve(quoteId, {
		expand: ['line_items'],
	})
	const customerId =
		typeof updatedQuote.customer === 'string'
			? updatedQuote.customer
			: updatedQuote.customer?.id
	let clientName = ''
	if (customerId) {
		const clientNamesResult = await fetchClientNamesByStripeIds([
			customerId,
		])
		if (
			!(clientNamesResult && 'errorMessage' in clientNamesResult) &&
			clientNamesResult.length > 0
		) {
			clientName = clientNamesResult[0].full_name || ''
		}
	}
	return { updatedQuote, clientName }
}
