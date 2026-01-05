'use server'
import { auth } from '@clerk/nextjs/server'
import { revalidateTag } from 'next/cache'
import type Stripe from 'stripe'
import type { z } from 'zod'
import { sendEmailWithTemplate } from '@/lib/actions/sendEmails-action'
import { updatedStripeAPIKeyDb } from '@/lib/DB/stripe-db'
import { isOrgAdmin } from '@/lib/utils/clerk'
import { formatCompanyName } from '@/lib/utils/resend'
import {
	acceptAndScheduleQuote,
	cancelStripeSubscription,
	createNotificationPayloadInvoice,
	createNotificationPayloadQuote,
	createStripeSubscriptionQuote,
	findOrCreateStripeCustomer,
	sendQuote,
} from '@/lib/utils/stripe-utils'
import {
	schemaCreateQuote,
	schemaCreateSubscription,
	schemaUpdateAPI,
	schemaUpdateStatement,
} from '@/lib/zod/schemas'
import type { MarkQuoteProps } from '@/types/stripe-types'
import { markPaidDb } from '../DB/clients-db'
import { fetchClientNamesByStripeIds } from '../dal/clients-dal'
import {
	fetchProductPrice,
	getInvoiceDAL,
	getStripeInstance,
	hasStripAPIKey,
} from '../dal/stripe-dal'
import { fetchNovuId } from '../dal/user-dal'
import { triggerNotificationSendToAdmin, triggerNovuEvent } from '../utils/novu'
import { createStripeWebhook } from '../utils/stripe-utils'

//MARK: Update API key
export async function updateStripeAPIKey({ formData }: { formData: FormData }) {
	const { isAdmin, orgId, userId } = await isOrgAdmin()
	if (!isAdmin) throw new Error('Not Admin')
	if (!userId) throw new Error('User ID is missing.')
	let novuId = null
	if (userId) novuId = await fetchNovuId(userId)

	const validatedFields = schemaUpdateAPI.safeParse({
		APIKey: formData.get('api_key'),
	})

	if (!validatedFields.success) throw new Error('Invalid input data')

	let result: { success: boolean; message: string }
	try {
		result = await updatedStripeAPIKeyDb(
			validatedFields.data,
			orgId || String(userId),
		)
		if (!result.success) throw new Error(result.message)

		await createStripeWebhook(validatedFields.data.APIKey, orgId || userId)

		if (novuId)
			await triggerNovuEvent(novuId.UserNovuId, 'stripe-api-key-updated')
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		throw new Error(errorMessage)
	}
	revalidateTag('api-key', 'default')
	return result
}

//MARK: Create quote
export async function createStripeQuote(
	quoteData: z.infer<typeof schemaCreateQuote>,
	clientId: number,
) {
	const { isAdmin, orgId, userId } = await isOrgAdmin()
	if (!isAdmin) throw new Error('Not Admin')
	if (!userId) throw new Error('User ID is missing.')

	const validatedFields = schemaCreateQuote.safeParse(quoteData)

	if (!validatedFields.success) {
		console.error('Validation Error:', validatedFields.error)
		throw new Error('Invalid input data')
	}

	try {
		const stripe = await getStripeInstance()
		if (!stripe) throw new Error('Failed to get Stripe instance')
		// 1. Find or Create Customer
		const customerId = await findOrCreateStripeCustomer(
			validatedFields.data.clientName,
			validatedFields.data.clientEmail,
			validatedFields.data.organization_id,
			clientId,
		)

		if (!customerId) {
			throw new Error('Stripe customer ID needed')
		}

		// 2. Handle Labour Product and Price
		let labourPriceId: string
		const labourProducts = await stripe.products.list({})
		let labourProduct = labourProducts.data.find(
			(product) => product.name === 'Labour',
		)
		if (!labourProduct) {
			labourProduct = await stripe.products.create({
				name: 'Labour',
			})
		}

		const labourPrices = await stripe.prices.list({})
		const labourPrice = labourPrices.data.find(
			(price) =>
				price.product === labourProduct.id &&
				price.unit_amount ===
					Math.round(validatedFields.data.labourCostPerUnit * 100) &&
				price.currency === 'cad',
		)
		if (!labourPrice) {
			const newPrice = await stripe.prices.create({
				unit_amount: Math.round(
					validatedFields.data.labourCostPerUnit * 100,
				),
				currency: 'cad',
				product: labourProduct.id,
			})
			labourPriceId = newPrice.id
		} else {
			labourPriceId = labourPrice.id
		}

		// 3. Handle Material Products and Prices
		const materialLineItems: { price: string; quantity: number }[] = []
		for (const material of validatedFields.data.materials) {
			// Skip material if materialType is empty or undefined
			if (!material.materialType) {
				console.warn(
					'Skipping material due to empty materialType:',
					material,
				)
				continue
			}

			let materialPriceId: string
			const materialProducts = await stripe.products.list({})
			let materialProduct = materialProducts.data.find(
				(product) => product.name === material.materialType,
			)
			if (!materialProduct) {
				materialProduct = await stripe.products.create({
					name: material.materialType,
				})
			}

			const materialPrices = await stripe.prices.list({})
			const materialPrice = materialPrices.data.find(
				(price) =>
					price.product === materialProduct.id &&
					price.unit_amount ===
						Math.round((material.materialCostPerUnit ?? 0) * 100) &&
					price.currency === 'cad',
			)
			if (!materialPrice) {
				const newPrice = await stripe.prices.create({
					unit_amount: Math.round(
						(material.materialCostPerUnit ?? 0) * 100,
					),
					currency: 'cad',
					product: materialProduct.id,
				})
				materialPriceId = newPrice.id
			} else {
				materialPriceId = materialPrice.id
			}
			materialLineItems.push({
				price: materialPriceId,
				quantity: material.materialUnits ?? 0,
			})
		}

		// 4. Create Line Items for the Quote
		const line_items = [
			{
				price: labourPriceId,
				quantity: validatedFields.data.labourUnits,
			},
			...materialLineItems,
		]

		const quote = await stripe.quotes.create({
			customer: customerId,
			line_items: line_items,
			collection_method: 'send_invoice',
			invoice_settings: { days_until_due: 10 },
		})

		await triggerNotificationSendToAdmin(
			orgId || String(userId),
			'quote-created',
			{
				quote: {
					amount: (quote.amount_total / 100).toString(),
					id: quote.id || '',
				},
				client: {
					name: validatedFields.data.clientName,
				},
			},
		)

		return { success: true, quoteId: quote.id }
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		console.error('Error creating Stripe quote:', errorMessage)
		return { success: false, message: errorMessage }
	}
}

//MARK: Update document (invoice or quote)
export async function updateStripeDocument(
	documentData: z.infer<typeof schemaUpdateStatement>,
) {
	const { isAdmin, orgId, userId } = await isOrgAdmin()
	if (!isAdmin) throw new Error('Not Admin')
	if (!userId) throw new Error('User ID is missing.')

	const validatedFields = schemaUpdateStatement.safeParse({
		...documentData,
		organization_id: orgId || userId,
	})

	if (!validatedFields.success) {
		console.error('Validation Error:', validatedFields.error)
		throw new Error('Invalid input data')
	}

	const { id, lines } = validatedFields.data

	try {
		const stripe = await getStripeInstance()
		if (!stripe) throw new Error('Failed to get Stripe instance')
		if (id.startsWith('in_')) {
			// Invoice update logic
			const existingInvoice = await getInvoiceDAL(id)
			if (!existingInvoice) throw new Error('Invoice not found')
			for (const item of existingInvoice.lines.data)
				await stripe.invoiceItems.del(item.id)
			const line_items = lines.map((line) => ({
				customer: existingInvoice.customer as string,
				invoice: id,
				unit_amount_decimal: String(Math.round(line.amount * 100)),
				currency: 'cad',
				description: line.description,
				quantity: line.quantity,
			}))
			for (const item of line_items)
				await stripe.invoiceItems.create(item)

			const updatedInvoice = await stripe.invoices.retrieve(id)

			const customerId =
				typeof updatedInvoice.customer === 'string'
					? updatedInvoice.customer
					: updatedInvoice.customer?.id
			let clientName = ''
			if (customerId) {
				const clientNamesResult = await fetchClientNamesByStripeIds([
					customerId,
				])
				if (
					!(
						clientNamesResult && 'errorMessage' in clientNamesResult
					) &&
					clientNamesResult.length > 0
				) {
					clientName = clientNamesResult[0].full_name || ''
				}
			}
			triggerNotificationSendToAdmin(
				orgId || userId,
				'invoice-edited',
				await createNotificationPayloadInvoice(
					updatedInvoice,
					clientName,
				),
			)
		} else if (id.startsWith('qt_')) {
			// Quote update logic
			const line_items = await Promise.all(
				lines.map(async (line) => {
					const products = await stripe.products.list()
					let product = products.data.find(
						(p) => p.name === (line.description || 'Service'),
					)
					if (!product) {
						product = await stripe.products.create({
							name: line.description || 'Service',
						})
					}

					return {
						price_data: {
							currency: 'cad',
							product: product.id,
							unit_amount: Math.round(line.amount * 100),
						},
						quantity: line.quantity,
					}
				}),
			)

			const updatedQuote = await stripe.quotes.update(id, {
				line_items: line_items,
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
					!(
						clientNamesResult && 'errorMessage' in clientNamesResult
					) &&
					clientNamesResult.length > 0
				) {
					clientName = clientNamesResult[0].full_name || ''
				}
			}
			const encodedClientName = encodeURIComponent(clientName)
			triggerNotificationSendToAdmin(
				orgId || userId,
				'quote-edited',
				await createNotificationPayloadQuote(
					updatedQuote,
					clientName,
					encodedClientName,
				),
			)
		} else {
			throw new Error('Invalid document ID prefix.')
		}

		return { success: true }
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		console.error('Error updating Stripe document:', errorMessage)
		return { success: false, message: errorMessage }
	}
}

//MARK: Resend invoice
export async function resendInvoice(invoiceId: string) {
	const { isAdmin, sessionClaims, orgId, userId } = await isOrgAdmin()
	if (!isAdmin) throw new Error('Not Admin')
	if (!orgId && !userId) throw new Error('Not logged in.')
	const stripe = await getStripeInstance()
	if (!stripe) throw new Error('Failed to get Stripe instance')
	//TODO: when in Prod there is not need for use to send the email strip will do that

	try {
		const invoice: Stripe.Invoice =
			await stripe.invoices.sendInvoice(invoiceId)

		if (!invoice.id)
			throw new Error('Invoice ID is missing after resending.')

		const customerEmail = invoice.customer_email
		const customerName =
			invoice.customer_name ||
			invoice.customer?.toString() ||
			'Valued Customer'
		const hostedInvoiceUrl = invoice.hosted_invoice_url

		if (!customerEmail)
			throw new Error('Customer email not found for invoice.')
		if (!hostedInvoiceUrl)
			throw new Error('Hosted invoice URL not found for invoice.')

		const companyName = formatCompanyName({
			orgName: sessionClaims?.orgName as string,
			userFullName: sessionClaims?.userFullName as string,
		})

		const emailSubject = `Your Invoice from ${companyName}`
		const emailBody = `Dear ${customerName},

                            Please find your invoice here: ${hostedInvoiceUrl}

                            Thank you for your business!`

		const formDataForEmail = new FormData()
		formDataForEmail.append('title', emailSubject)
		formDataForEmail.append('message', emailBody)

		const emailResult = await sendEmailWithTemplate(
			formDataForEmail,
			customerEmail,
		)

		if (!emailResult) throw new Error('Failed to send invoice email.')

		// triggerNotificationSendToAdmin(orgId || userId!, 'invoice-sent', createInvoicePayload(customerName, invoice.amount_due, invoice.id))

		// console.log("Invoice re-sent and email sent successfully:", invoice.id);
	} catch (error) {
		console.error(error)
		throw new Error(`Failed to resend invoice ${invoiceId}`)
	}
}

//MARK:Mark invoice paid
export async function markInvoicePaid(invoiceId: string) {
	const { isAdmin } = await isOrgAdmin()
	if (!isAdmin) throw new Error('Not Admin')

	const stripe = await getStripeInstance()
	if (!stripe) throw new Error('Failed to get Stripe instance')
	try {
		await stripe.invoices.pay(invoiceId, {
			paid_out_of_band: true,
		})
	} catch (error) {
		console.error(error)
		throw new Error(`Failed to mark invoice ${invoiceId} as paid`)
	}
}
//MARK:Mark invoice void
export async function markInvoiceVoid(invoiceId: string) {
	const { isAdmin, orgId, userId } = await isOrgAdmin()
	if (!isAdmin) throw new Error('Not Admin')
	if (!userId) throw new Error('No user')

	const stripe = await getStripeInstance()
	if (!stripe) throw new Error('Failed to get Stripe instance')
	try {
		const invoice = await stripe.invoices.voidInvoice(invoiceId)

		const customerId =
			typeof invoice.customer === 'string'
				? invoice.customer
				: invoice.customer?.id

		if (customerId) {
			const amountPaid = Number(invoice.amount_due / 100)
			const dbUpdateResult = await markPaidDb(
				invoiceId,
				customerId,
				amountPaid,
				orgId || userId,
			)
			if (!dbUpdateResult.success) {
				console.warn(
					`Failed to update local database for invoice ${invoiceId}: ${dbUpdateResult.message}`,
				)
			}
			await triggerNotificationSendToAdmin(
				orgId || userId,
				'invoice-void',
				await createNotificationPayloadInvoice(
					invoice,
					invoice?.customer_name || 'Unknown Customer',
				),
			)
		} else {
			console.warn(
				`Skipping local DB update for invoice ${invoiceId}: Missing customer email.`,
			)
		}
	} catch (error) {
		console.error(error)
		throw new Error(`Failed to mark invoice ${invoiceId} as paid`)
	}
}

async function getQuoteDetailsAndClientName(quoteId: string, stripe: Stripe) {
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

//MARK: Mark quote
export async function markQuote({ action, quoteId }: MarkQuoteProps) {
	const { isAdmin, userId, orgId, sessionClaims } = await isOrgAdmin()
	if (!isAdmin) throw new Error('Not Admin')
	if (!userId) throw new Error('No user')
	if (!sessionClaims) throw new Error('Session claims are missing.')

	const stripe = await getStripeInstance()
	if (!stripe) throw new Error('Failed to get Stripe instance')
	try {
		// let resultQuote: Stripe.Response<Stripe.Quote>;
		const { updatedQuote, clientName } = await getQuoteDetailsAndClientName(
			quoteId,
			stripe,
		)

		const notificationType = {
			accept: 'quote-accepted',
			send: 'quote-sent',
			cancel: 'quote-cancelled',
		}

		let id: string | null | undefined
		if (action === 'accept') {
			id = await acceptAndScheduleQuote(stripe, updatedQuote)
		} else if (action === 'send') {
			await stripe.quotes.finalizeQuote(quoteId)
			await sendQuote(quoteId, stripe, sessionClaims)
		} else if (action === 'cancel') {
			await stripe.quotes.cancel(quoteId)
		} else {
			throw new Error('Invalid action for quote operation.')
		}
		const encodedClientName = encodeURIComponent(clientName)
		if (notificationType[action]) {
			triggerNotificationSendToAdmin(
				orgId || userId,
				notificationType[action],
				await createNotificationPayloadQuote(
					updatedQuote,
					clientName,
					encodedClientName,
					id || '',
				),
			)
		}
	} catch (e) {
		throw new Error(`Error: ${e instanceof Error ? e.message : String(e)}`)
	}
}

//MARK: Cancel Subscription
export async function cancelSubscription(subscriptionId: string) {
	const { isAdmin } = await isOrgAdmin()
	if (!isAdmin) throw new Error('Not Admin')

	try {
		await cancelStripeSubscription(subscriptionId)
		return { success: true }
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		console.error('Error canceling subscription:', errorMessage)
		return { success: false, message: errorMessage }
	}
}

//MARK: Has stripe api key
export async function hasStripeApiKeyAction(): Promise<boolean> {
	return await hasStripAPIKey()
}

//Mark:Create Subscription
export async function createSubscriptionQuoteAction(
	formData: FormData,
	snow: boolean,
) {
	const { orgId, userId, sessionClaims } = await auth.protect()
	const organizationId = orgId || userId

	if (!organizationId) {
		throw new Error('Unauthorized')
	}

	const parsed = schemaCreateSubscription.safeParse({
		clientName: formData.get('clientName'),
		clientEmail: formData.get('clientEmail'),
		phone_number: formData.get('phone_number'),
		address: formData.get('address'),
		serviceType: formData.get('serviceType'),
		price_per_month: parseFloat(formData.get('price_per_month') as string),
		startDate: formData.get('startDate'),
		endDate: formData.get('endDate') || undefined,
		notes: formData.get('notes') || undefined,
		organization_id: organizationId,
		collectionMethod: formData.get('collectionMethod') || undefined, // Add this line
	})

	if (!parsed.success) {
		console.error('Validation Error:', parsed.error)
		throw new Error('Invalid form data')
	}

	try {
		const subscription = await createStripeSubscriptionQuote(
			parsed.data,
			sessionClaims,
			snow,
		)
		return {
			success: true,
			subscription: { id: subscription.id, status: subscription.status },
		}
	} catch (error) {
		console.error('Error creating subscription:', error)
		throw new Error('Failed to create subscription')
	}
}

export async function getProductPrice(productId: string) {
	const { isAdmin } = await isOrgAdmin()
	if (!isAdmin) throw new Error('Not Admin')

	try {
		const price = await fetchProductPrice(productId)
		return price
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		console.error('Error fetching product price:', errorMessage)
		return null
	}
}
