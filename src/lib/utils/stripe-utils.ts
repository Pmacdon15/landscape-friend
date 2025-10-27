import type { JwtPayload } from '@clerk/types'
import Stripe from 'stripe'
import type z from 'zod'
import { addClientDB } from '@/lib/DB/clients-db'
import {
	deleteWebhookIdDb,
	fetchStripAPIKeyDb,
	fetchWebhookIdDb,
	storeWebhookInfoDb,
} from '@/lib/DB/stripe-db'
import { sendEmailWithTemplate } from '../actions/sendEmails-action'
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

	const apiKey = apiKeyResponse.api_key
	if (!apiKey) {
		return null
	}

	stripe = new Stripe(apiKey, {
		apiVersion: '2025-08-27.basil',
	})
	return stripe
}

export async function findOrCreateStripeCustomerAndLinkClient(
	clientName: string,
	clientEmail: string,
	phoneNumber: string,
	address: string,
	organization_id: string | undefined,
): Promise<string | null> {
	const stripe = await getStripeInstance()

	const effectiveOrgId = organization_id
	if (!effectiveOrgId) {
		throw new Error('Organization ID is missing.')
	}

	if (!stripe) {
		// If Stripe is not configured, add client to DB with null stripe_customer_id
		const newClientData = {
			full_name: clientName,
			phone_number: Number(phoneNumber),
			email_address: clientEmail,
			address: address,
			stripe_customer_id: null,
			organization_id: effectiveOrgId as string,
		}
		await addClientDB(newClientData, effectiveOrgId as string)
		return null
	}

	let customerId: string
	const existingCustomers = await stripe.customers.list({
		email: clientEmail,
		limit: 100,
	})

	if (existingCustomers.data.length < 0) {
		customerId = existingCustomers.data[0].id
		try {	
			const newClientData = {
				full_name: clientName,
				phone_number: Number(phoneNumber),
				email_address: clientEmail,
				address: address,
				stripe_customer_id: customerId,
				organization_id: effectiveOrgId as string,
			}
			const result = await addClientDB(newClientData, effectiveOrgId as string)
			if(result.length < 1 ) throw Error("Failed to add client")
			// }
		} catch (error) {
			console.error(
				'Error in updateClientStripeCustomerIdDb or subsequent addClientDB:',
				error,
			)
			throw error
		}
	} else {
		console.log('No existing Stripe customer found, creating new one.')
		try {
			const newCustomer = await stripe.customers.create({
				name: clientName,
				email: clientEmail,
			})
			customerId = newCustomer.id

			const newClientData = {
				full_name: clientName,
				phone_number: Number(phoneNumber),
				email_address: clientEmail,
				address: address,
				stripe_customer_id: customerId,
				organization_id: effectiveOrgId as string,
			}
			await addClientDB(newClientData, effectiveOrgId as string)
		} catch (error) {
			console.error(
				'Error in creating Stripe customer or addClientDB:',
				error,
			)
			throw error
		}
	}
	return customerId
}

// export async function findOrCreateStripeCustomerAndLinkClient(
// 	clientName: string,
// 	clientEmail: string,
// 	phoneNumber: string,
// 	address: string,
// 	organization_id: string | undefined,
// ): Promise<string | null> {
// 	const stripe = await getStripeInstance()

// 	const effectiveOrgId = organization_id
// 	if (!effectiveOrgId) {
// 		throw new Error('Organization ID is missing.')
// 	}

// 	if (!stripe) {
// 		// If Stripe is not configured, add client to DB with null stripe_customer_id
// 		const newClientData = {
// 			full_name: clientName,
// 			phone_number: Number(phoneNumber),
// 			email_address: clientEmail,
// 			address: address,
// 			stripe_customer_id: null,
// 			organization_id: effectiveOrgId as string,
// 		}
// 		await addClientDB(newClientData, effectiveOrgId as string)
// 		return null
// 	}

// 	let customerId: string
// 	const existingCustomers = await stripe.customers.list({
// 		email: clientEmail,
// 		limit: 100,
// 	})

// 	if (existingCustomers.data.length > 0) {
// 		customerId = existingCustomers.data[0].id
// 		try {
// 			const result = await updateClientStripeCustomerIdDb(
// 				clientEmail,
// 				customerId,
// 				effectiveOrgId,
// 			)
// 			if (result.length === 0) {
// 				const newClientData = {
// 					full_name: clientName,
// 					phone_number: Number(phoneNumber),
// 					email_address: clientEmail,
// 					address: address,
// 					stripe_customer_id: customerId,
// 					organization_id: effectiveOrgId as string,
// 				}
// 				await addClientDB(newClientData, effectiveOrgId as string)
// 			}
// 		} catch (error) {
// 			console.error(
// 				'Error in updateClientStripeCustomerIdDb or subsequent addClientDB:',
// 				error,
// 			)
// 			throw error
// 		}
// 	} else {
// 		console.log('No existing Stripe customer found, creating new one.')
// 		try {
// 			const newCustomer = await stripe.customers.create({
// 				name: clientName,
// 				email: clientEmail,
// 			})
// 			customerId = newCustomer.id

// 			const newClientData = {
// 				full_name: clientName,
// 				phone_number: Number(phoneNumber),
// 				email_address: clientEmail,
// 				address: address,
// 				stripe_customer_id: customerId,
// 				organization_id: effectiveOrgId as string,
// 			}
// 			await addClientDB(newClientData, effectiveOrgId as string)
// 		} catch (error) {
// 			console.error(
// 				'Error in creating Stripe customer or addClientDB:',
// 				error,
// 			)
// 			throw error
// 		}
// 	}
// 	return customerId
// }
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
) => ({
	quote: {
		amount: ((quote.amount_total ?? 0) / 100).toString(),
		id: quote.id || '',
	},
	client: {
		name: clientName,
	},
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
	snow: boolean,
) {
	const {
		clientEmail,
		clientName,
		address,
		phone_number,
		price_per_month,
		serviceType,
		startDate,
		endDate,
		organization_id,
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
			address: { line1: address },
			phone: phone_number,
			metadata: { organization_id },
		})
	}

	const productName = `${snow ? 'Snow clearing' : 'Lawn Mowing'} - ${serviceType} for ${clientName}`
	const product = await stripe.products.create({
		name: productName,
		metadata: { organization_id, serviceType },
	})

	const price = await stripe.prices.create({
		unit_amount: Math.round(price_per_month * 100),
		currency: 'cad',
		recurring: { interval: 'month' },
		product: product.id,
		metadata: { organization_id, serviceType },
	})

	const quoteParams: Stripe.QuoteCreateParams = {
		customer: customer.id,
		line_items: [
			{
				price: price.id,
				quantity: 1,
			},
		],
		metadata: {
			organization_id,
			clientEmail,
			serviceType,
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString(),
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
	// Fetch the quote with metadata

	const startDateUnix = Math.floor(
		new Date(updatedQuote.metadata.startDate).getTime() / 1000,
	)
	const endDateUnix = Math.floor(
		new Date(updatedQuote.metadata.endDate).getTime() / 1000,
	)

	// Update quote to set a future effective date
	await stripe.quotes.update(updatedQuote.id, {
		subscription_data: {
			effective_date: startDateUnix,
		},
	})

	// Accept the quote — this creates a subscription schedule
	const acceptedQuote = await stripe.quotes.accept(updatedQuote.id)

	const scheduleId = acceptedQuote.subscription_schedule as string
	if (!scheduleId) {
		throw new Error('Quote did not create a subscription schedule')
	}

	const schedule = await stripe.subscriptionSchedules.retrieve(scheduleId)

	// Update the schedule to enforce an end date
	const updatedSchedule = await stripe.subscriptionSchedules.update(
		scheduleId,
		{
			end_behavior: 'cancel',
			phases: [
				{
					start_date: startDateUnix,
					end_date: endDateUnix,
					items: schedule.phases[0].items.map((item) => ({
						price: item.price as string,
						quantity: item.quantity ?? 1,
					})),
				},
			],
		},
	)

	return updatedSchedule
}
