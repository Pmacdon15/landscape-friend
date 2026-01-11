import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { fetchStripAPIKeyDb } from '@/lib/DB/stripe-db'
import { isOrgAdmin } from '@/lib/utils/clerk'
import type {
	APIKey,
	FetchInvoicesResponse,
	FetchQuotesResponse,
	FetchSubscriptionsResponse,
	StripeInvoice,
	StripeQuote,
} from '@/types/stripe-types'
import type { Subscription } from '@/types/subscription-types'
import { getProductPrice } from '../actions/stripe-action'
import { fetchClientNamesByStripeIds } from './clients-dal'

let stripe: Stripe | null = null

export async function getStripeInstance(): Promise<Stripe | null> {
	const apiKeyResponse = await fetchStripeAPIKey()
	if (apiKeyResponse instanceof Error) {
		return null
	}

	if ('errorMessage' in apiKeyResponse) return null
	const apiKey = apiKeyResponse.apk_key ?? null
	if (!apiKey) {
		return null
	}

	stripe = new Stripe(apiKey)
	return stripe
}

export async function fetchStripeAPIKey(): Promise<
	APIKey | { errorMessage: string }
> {
	const { orgId, userId } = await auth.protect()
	try {
		const result = await fetchStripAPIKeyDb(orgId || userId)
		if (!result || !result.api_key)
			return { errorMessage: 'API key not found' }
		return { apk_key: result.api_key }
	} catch (e: unknown) {
		console.error(e)
		// if (e instanceof Error) return e
		return { errorMessage: 'An unknown error occurred' }
	}
}

export async function fetchProducts(): Promise<
	| {
			products: Stripe.Product[]
			productsPrices: Stripe.Price[]
	  }
	| { errorMessage: string }
> {
	const { isAdmin } = await isOrgAdmin(true)
	if (!isAdmin) {
		return { errorMessage: 'Not org admin' }
	}
	const stripe = await getStripeInstance()
	if (!stripe) {
		return { errorMessage: 'Failed to initialize Stripe instance' }
	}

	try {
		let products: Stripe.Product[] = []
		let hasMore = true
		let startingAfter: string | undefined

		while (hasMore) {
			const response: Stripe.ApiList<Stripe.Product> =
				await stripe.products.list({
					active: true,
					limit: 100,
					starting_after: startingAfter,
				})

			products = products.concat(response.data)
			hasMore = response.has_more
			if (hasMore) {
				startingAfter = response.data[response.data.length - 1].id
			}
		}

		const filteredProducts = products.filter(
			(product) => !product.metadata.serviceType,
		)

		const filteredProductsPrices = (
			await Promise.all(
				filteredProducts.map((product) => getProductPrice(product.id)),
			)
		).filter((price): price is Stripe.Price => price !== null)

		return {
			products: filteredProducts,
			productsPrices: filteredProductsPrices,
		}
	} catch (error) {
		if (error instanceof Error) {
			throw error
		}
		return { errorMessage: 'An unknown error occurred' }
	}
}

export async function hasStripAPIKey(): Promise<boolean> {
	const { orgId, userId } = await auth.protect()
	try {
		const result = await fetchStripAPIKeyDb(orgId || userId)
		if (!result || !result.api_key) return false
		return true
	} catch (e) {
		if (e instanceof Error) return false
		return false
	}
}

export async function fetchInvoices(
	typesOfInvoices: string,
	page: number,
	searchTerm: string,
): Promise<FetchInvoicesResponse | { errorMessage: string }> {
	const { isAdmin } = await isOrgAdmin()
	if (!isAdmin) return { errorMessage: 'Not Admin' }

	const stripe = await getStripeInstance()
	if (!stripe) return { errorMessage: 'Failed to get Stripe instance' }
	const pageSize = Number(process.env.PAGE_SIZE) || 10

	try {
		let allInvoices: Stripe.Invoice[] = []
		let hasMore = true
		let startingAfter: string | undefined

		const params: Stripe.InvoiceListParams = { limit: 100 }
		if (
			typesOfInvoices &&
			['draft', 'paid', 'open', 'void'].includes(typesOfInvoices)
		) {
			params.status = typesOfInvoices as
				| 'draft'
				| 'paid'
				| 'open'
				| 'void'
		}

		while (hasMore) {
			const invoiceBatch: Stripe.ApiList<Stripe.Invoice> =
				await stripe.invoices.list({
					...params,
					starting_after: startingAfter,
				})
			allInvoices = allInvoices.concat(invoiceBatch.data)
			hasMore = invoiceBatch.has_more
			if (hasMore) {
				startingAfter =
					invoiceBatch.data[invoiceBatch.data.length - 1].id
			}
		}

		let filteredInvoices = allInvoices
		if (searchTerm) {
			const lowerCaseSearchTerm = searchTerm.toLowerCase()

			filteredInvoices = allInvoices.filter((invoice) => {
				if (
					invoice.customer_name
						?.toLowerCase()
						.includes(lowerCaseSearchTerm) ||
					invoice.customer_email
						?.toLowerCase()
						.includes(lowerCaseSearchTerm) ||
					invoice.id?.toLowerCase().includes(lowerCaseSearchTerm) ||
					invoice.number?.toLowerCase().includes(lowerCaseSearchTerm)
				) {
					return true
				}

				if (!Number.isNaN(parseFloat(lowerCaseSearchTerm))) {
					if (
						invoice.total !== null &&
						(invoice.total / 100)
							.toString()
							.startsWith(lowerCaseSearchTerm)
					) {
						return true
					}
					if (
						invoice.amount_due !== null &&
						(invoice.amount_due / 100)
							.toString()
							.startsWith(lowerCaseSearchTerm)
					) {
						return true
					}
				}

				return false
			})
		}

		const totalInvoices = filteredInvoices.length
		const totalPages = Math.ceil(totalInvoices / pageSize)
		const offset = (page - 1) * pageSize
		const paginatedInvoices = filteredInvoices.slice(
			offset,
			offset + pageSize,
		)

		const uniqueCustomerIds = [
			...new Set(
				allInvoices
					.map((invoice) => invoice.customer)
					.filter(
						(customer): customer is string =>
							typeof customer === 'string',
					),
			),
		]

		const clientNamesResult =
			await fetchClientNamesByStripeIds(uniqueCustomerIds)

		if (clientNamesResult && 'errorMessage' in clientNamesResult) {
			throw clientNamesResult
		}

		const clientNamesMap = new Map<string, string>()
		clientNamesResult.forEach((client) => {
			if (client.stripe_customer_id && client.full_name) {
				clientNamesMap.set(client.stripe_customer_id, client.full_name)
			}
		})

		const strippedInvoices = paginatedInvoices
			.filter((invoice) => invoice.id)
			.map((invoice) => ({
				id: String(invoice.id),
				object: invoice.object,
				amount_due: invoice.amount_due / 100,
				amount_paid: invoice.amount_paid / 100,
				amount_remaining: invoice.amount_remaining / 100,
				created: invoice.created,
				currency: invoice.currency,
				customer:
					typeof invoice.customer === 'string'
						? invoice.customer
						: invoice.customer?.id || '',
				customer_email: invoice.customer_email || '',
				customer_name: invoice.customer_name || '',
				due_date: invoice.due_date || 0,
				hosted_invoice_url: invoice.hosted_invoice_url || '',
				invoice_pdf: invoice.invoice_pdf || '',
				number: invoice.number || '',
				status: invoice.status,
				total: invoice.total / 100,
				lines: {
					data: invoice.lines.data.map((lineItem) => ({
						id: lineItem.id,
						object: lineItem.object,
						amount: lineItem.amount / 100,
						currency: lineItem.currency,
						description: lineItem.description,
						quantity: lineItem.quantity || 0,
					})),
				},
				client_name:
					typeof invoice.customer === 'string'
						? clientNamesMap.get(invoice.customer)
						: undefined,
			}))

		return { invoices: strippedInvoices as StripeInvoice[], totalPages }
	} catch (error) {
		console.error(error)
		return { errorMessage: 'Failed to fetch invoices' }
	}
}

export async function fetchQuotes(
	typesOfQuotes: string,
	page: number,
	searchTerm: string,
): Promise<FetchQuotesResponse> {
	const { isAdmin } = await isOrgAdmin()
	if (!isAdmin) throw new Error('Not Admin')

	const stripe = await getStripeInstance()
	if (!stripe) throw new Error('Failed to get Stripe instance')
	const pageSize = Number(process.env.PAGE_SIZE) || 10

	try {
		let allQuotes: Stripe.Quote[] = []
		let hasMore = true
		let startingAfter: string | undefined

		const params: Stripe.QuoteListParams = { limit: 100 }
		if (
			typesOfQuotes &&
			['draft', 'open', 'accepted', 'canceled'].includes(typesOfQuotes)
		) {
			params.status = typesOfQuotes as
				| 'draft'
				| 'open'
				| 'accepted'
				| 'canceled'
		}

		while (hasMore) {
			const quoteBatch: Stripe.ApiList<Stripe.Quote> =
				await stripe.quotes.list({
					...params,
					starting_after: startingAfter,
					expand: ['data.line_items', 'data.customer'],
				})
			allQuotes = allQuotes.concat(quoteBatch.data)
			hasMore = quoteBatch.has_more
			if (hasMore) {
				startingAfter = quoteBatch.data[quoteBatch.data.length - 1].id
			}
		}

		const uniqueCustomerIds = [
			...new Set(
				allQuotes
					.map((quote) =>
						typeof quote.customer === 'string'
							? quote.customer
							: quote.customer?.id,
					)
					.filter((id): id is string => Boolean(id)), // type guard ensures it's string
			),
		]

		const clientNamesResult =
			await fetchClientNamesByStripeIds(uniqueCustomerIds)
		if (clientNamesResult && 'errorMessage' in clientNamesResult) {
			throw clientNamesResult
		}
		const clientNamesMap = new Map<string, string>()
		clientNamesResult.forEach((client) => {
			if (client.stripe_customer_id && client.full_name) {
				clientNamesMap.set(client.stripe_customer_id, client.full_name)
			}
		})

		let filteredQuotes = allQuotes
		if (searchTerm) {
			const lowerCaseSearchTerm = searchTerm.toLowerCase()
			filteredQuotes = allQuotes.filter((quote) => {
				const customerId =
					typeof quote.customer === 'string'
						? quote.customer
						: quote.customer?.id
				const clientName = customerId
					? clientNamesMap.get(customerId)
					: undefined
				const stripeCustomerName =
					typeof quote.customer === 'object' &&
					quote.customer &&
					'name' in quote.customer
						? quote.customer.name
						: undefined

				const amountTotalStr = (quote.amount_total / 100).toString() // convert cents → dollars
				const lineItemAmounts = (quote.line_items?.data || []).map(
					(li) =>
						(
							li.amount_subtotal /
							(li.quantity || 1) /
							100
						).toString(),
				)

				return (
					quote.description
						?.toLowerCase()
						.includes(lowerCaseSearchTerm) ||
					quote.id?.toLowerCase().includes(lowerCaseSearchTerm) ||
					clientName?.toLowerCase().includes(lowerCaseSearchTerm) ||
					stripeCustomerName
						?.toLowerCase()
						.includes(lowerCaseSearchTerm) ||
					amountTotalStr.includes(lowerCaseSearchTerm) ||
					lineItemAmounts.some((amount) =>
						amount.includes(lowerCaseSearchTerm),
					)
				)
			})
		}

		const totalQuotes = filteredQuotes.length
		const totalPages = Math.ceil(totalQuotes / pageSize)
		const offset = (page - 1) * pageSize
		const paginatedQuotes = filteredQuotes.slice(offset, offset + pageSize)

		const strippedQuotes = paginatedQuotes.map((quote) => ({
			id: quote.id,
			object: quote.object,
			amount_total: quote.amount_total,
			customer: quote.customer,
			status: quote.status as string,
			expires_at: quote.expires_at,
			created: quote.created,
			metadata: quote.metadata,
			customer_name:
				typeof quote.customer === 'object' &&
				quote.customer !== null &&
				'name' in quote.customer
					? quote.customer.name
					: undefined,
			customer_email:
				typeof quote.customer === 'object' &&
				quote.customer !== null &&
				'email' in quote.customer
					? quote.customer.email
					: undefined,
			client_name:
				typeof quote.customer === 'string'
					? clientNamesMap.get(quote.customer)
					: undefined,
			lines: {
				data: (quote.line_items?.data || []).map((lineItem) => ({
					id: lineItem.id,
					object: lineItem.object,
					amount:
						lineItem.amount_subtotal /
						(lineItem.quantity || 1) /
						100,
					currency: lineItem.currency,
					description: lineItem.description,
					quantity: lineItem.quantity || 0,
				})),
			},
		}))
		return { quotes: strippedQuotes as StripeQuote[], totalPages }
	} catch (error) {
		console.error(error)
		throw new Error('Failed to fetch quotes')
	}
}

export async function getInvoiceDAL(invoiceId: string): Promise<StripeInvoice> {
	const { isAdmin } = await isOrgAdmin()
	if (!isAdmin) throw new Error('Not Admin')

	const stripe = await getStripeInstance()
	if (!stripe) throw new Error('Failed to get Stripe instance')
	const invoice = await stripe.invoices.retrieve(invoiceId, {
		expand: ['lines.data'],
	})

	if (!invoice) {
		throw new Error('Invoice not found')
	}

	// Convert to plain object
	const plainInvoice: StripeInvoice = {
		id: invoice.id,
		object: invoice.object,
		amount_due: invoice.amount_due / 100,
		amount_paid: invoice.amount_paid / 100,
		amount_remaining: invoice.amount_remaining / 100,
		created: invoice.created,
		currency: invoice.currency,
		customer:
			typeof invoice.customer === 'string'
				? invoice.customer
				: invoice.customer?.id || '',
		customer_email: invoice.customer_email || '',
		customer_name: invoice.customer_name || '',
		due_date: invoice.due_date || 0,
		hosted_invoice_url: invoice.hosted_invoice_url || '',
		invoice_pdf: invoice.invoice_pdf || '',
		number: invoice.number || '',
		status: invoice.status,
		total: invoice.total / 100,
		lines: {
			data: invoice.lines.data.map((lineItem) => ({
				id: lineItem.id,
				object: lineItem.object,
				// Use unit_amount if available, fallback to amount / quantity
				amount: lineItem.amount / (lineItem.quantity || 1) / 100,
				currency: lineItem.currency,
				description: lineItem.description,
				quantity: lineItem.quantity || 0,
			})),
		},
	}
	console.log(JSON.stringify(plainInvoice, null, 2))
	return plainInvoice
}

export async function getQuoteDAL(quoteId: string): Promise<StripeQuote> {
	const { isAdmin } = await isOrgAdmin()
	if (!isAdmin) throw new Error('Not Admin')

	const stripe = await getStripeInstance()
	if (!stripe) throw new Error('Failed to get Stripe instance')
	const quote = await stripe.quotes.retrieve(quoteId, {
		expand: ['line_items.data'],
	})

	if (!quote) {
		throw new Error('Quote not found')
	}

	const plainQuote: StripeQuote = {
		id: quote.id,
		object: quote.object,
		amount_total: quote.amount_total,
		customer:
			typeof quote.customer === 'string'
				? quote.customer
				: quote.customer?.id || '',
		status: quote.status,
		expires_at: quote.expires_at,
		created: quote.created,
		metadata: quote.metadata,
		lines: {
			data: (quote.line_items?.data || []).map((lineItem) => ({
				id: lineItem.id,
				object: lineItem.object,
				amount:
					lineItem.amount_subtotal / (lineItem.quantity || 1) / 100,
				currency: lineItem.currency,
				description: lineItem.description,
				quantity: lineItem.quantity || 0,
			})),
		},
	}

	return plainQuote
}

export async function fetchSubscriptions(
	typesOfSubscriptions: string,
	page: number,
	searchTerm: string,
): Promise<FetchSubscriptionsResponse> {
	const { isAdmin } = await isOrgAdmin()
	if (!isAdmin) throw new Error('Not Admin')

	const stripe = await getStripeInstance()
	if (!stripe) throw new Error('Failed to get Stripe instance')
	const pageSize = Number(process.env.PAGE_SIZE) || 10

	try {
		let allSubscriptions: Stripe.Subscription[] = []
		let hasMore = true
		let startingAfter: string | undefined

		const params: Stripe.SubscriptionListParams = {
			limit: 100,
			expand: ['data.customer'],
		}
		if (
			typesOfSubscriptions &&
			['active', 'canceled', 'incomplete'].includes(typesOfSubscriptions)
		) {
			params.status = typesOfSubscriptions as
				| 'active'
				| 'canceled'
				| 'incomplete'
		}

		while (hasMore) {
			const subscriptionBatch: Stripe.ApiList<Stripe.Subscription> =
				await stripe.subscriptions.list({
					...params,
					starting_after: startingAfter,
				})
			allSubscriptions = allSubscriptions.concat(subscriptionBatch.data)
			hasMore = subscriptionBatch.has_more
			if (hasMore) {
				startingAfter =
					subscriptionBatch.data[subscriptionBatch.data.length - 1].id
			}
			console.log('Sub: ', subscriptionBatch)
		}

		let filteredSubscriptions = allSubscriptions
		if (searchTerm) {
			const lowerCaseSearchTerm = searchTerm.toLowerCase()
			filteredSubscriptions = allSubscriptions.filter((subscription) => {
				const customer = subscription.customer as Stripe.Customer
				return (
					customer.name
						?.toLowerCase()
						.includes(lowerCaseSearchTerm) ||
					customer.email
						?.toLowerCase()
						.includes(lowerCaseSearchTerm) ||
					subscription.id?.toLowerCase().includes(lowerCaseSearchTerm)
				)
			})
		}

		const totalSubscriptions = filteredSubscriptions.length
		const totalPages = Math.ceil(totalSubscriptions / pageSize)
		const offset = (page - 1) * pageSize
		const paginatedSubscriptions = filteredSubscriptions.slice(
			offset,
			offset + pageSize,
		)

		const customerIds = paginatedSubscriptions.map(
			(subscription) => (subscription.customer as Stripe.Customer).id,
		)
		const clientNamesResult = await fetchClientNamesByStripeIds(customerIds)

		if (clientNamesResult instanceof Error) {
			throw clientNamesResult
		}

		const uniqueProductIds = new Set<string>()
		allSubscriptions.forEach((subscription) => {
			subscription.items.data.forEach((item) => {
				if (typeof item.price.product === 'string') {
					uniqueProductIds.add(item.price.product)
				}
			})
		})

		const productNamesMap = new Map<string, string>()
		for (const productId of uniqueProductIds) {
			try {
				const product = await stripe.products.retrieve(productId)
				productNamesMap.set(productId, product.name)
			} catch (error) {
				console.error(`Error fetching product ${productId}:`, error)
				productNamesMap.set(productId, 'Unknown Product') // Fallback
			}
		}

		const strippedSubscriptions = await Promise.all(
			paginatedSubscriptions.map(async (subscription) => {
				let schedule = null
				if (subscription.schedule) {
					try {
						const scheduleId =
							typeof subscription.schedule === 'string'
								? subscription.schedule
								: subscription.schedule.id
						schedule =
							await stripe.subscriptionSchedules.retrieve(
								scheduleId,
							)
						schedule = {
							id: schedule.id,
							status: schedule.status,
							phases: schedule.phases.map((phase) => ({
								start_date: phase.start_date,
								end_date: phase.end_date,
							})),
						}
					} catch (error) {
						console.error(
							`Error retrieving subscription schedule for ${subscription.id}:`,
							error,
						)
					}
				}

				return {
					id: subscription.id,
					object: subscription.object,
					status: subscription.status,
					start_date: subscription.start_date,
					cancel_at_period_end: subscription.cancel_at_period_end,
					canceled_at: subscription.canceled_at,
					created: subscription.created,
					subscription_schedule: schedule,
					customer: {
						id: (subscription.customer as Stripe.Customer).id,
						name:
							(subscription.customer as Stripe.Customer).name ||
							undefined,
						email:
							(subscription.customer as Stripe.Customer).email ||
							undefined,
					},
					items: {
						data: subscription.items.data.map((item) => ({
							id: item.id,
							object: item.object,
							quantity: item.quantity || 0,
							price: {
								id: item.price.id,
								object: item.price.object,
								active: item.price.active,
								currency: item.price.currency,
								product:
									productNamesMap.get(
										item.price.product as string,
									) || 'Unknown Product',
								unit_amount: item.price.unit_amount || 0,
							},
						})),
					},
				}
			}),
		)

		return {
			subscriptions: strippedSubscriptions as Subscription[],
			totalPages,
		}
	} catch (error) {
		console.error(error)
		throw new Error('Failed to fetch subscriptions')
	}
}

export async function fetchProductPrice(
	productId: string,
): Promise<Stripe.Price | null> {
	await auth.protect()
	const stripe = await getStripeInstance()
	if (!stripe) {
		throw new Error('Failed to initialize Stripe instance')
	}

	try {
		const prices = await stripe.prices.list({
			product: productId,
			active: true,
			limit: 1,
		})

		if (prices.data.length > 0) {
			return prices.data[0]
		}

		return null
	} catch (error) {
		if (error instanceof Error) {
			throw error
		}
		throw new Error(
			'An unknown error occurred while fetching product price.',
		)
	}
}

//MARK: Fetch Billing Overview Data
import type {
	BillingOverviewItem,
	FetchBillingOverviewResponse,
} from '@/types/stripe-types'

export async function fetchBillingOverviewData(
	page: number,
	searchTerm: string,
): Promise<FetchBillingOverviewResponse | { errorMessage: string }> {
	const { isAdmin } = await isOrgAdmin()
	if (!isAdmin) return { errorMessage: 'Not Admin' }

	const stripe = await getStripeInstance()
	if (!stripe) return { errorMessage: 'Failed to get Stripe instance' }

	const pageSize = Number(process.env.PAGE_SIZE) || 10
	const currentYearStart =
		new Date(new Date().getFullYear(), 0, 1).getTime() / 1000

	try {
		// 1. Fetch Invoices
		let allInvoices: Stripe.Invoice[] = []
		let hasMoreInvoices = true
		let startingAfterInvoice: string | undefined

		while (hasMoreInvoices) {
			const invoiceBatch: Stripe.ApiList<Stripe.Invoice> =
				await stripe.invoices.list({
					limit: 100,
					starting_after: startingAfterInvoice,
					expand: ['data.lines.data'],
				})
			allInvoices = allInvoices.concat(invoiceBatch.data)
			hasMoreInvoices = invoiceBatch.has_more
			if (hasMoreInvoices) {
				startingAfterInvoice =
					invoiceBatch.data[invoiceBatch.data.length - 1].id
			}
		}

		// 2. Fetch Subscriptions
		let allSubscriptions: Stripe.Subscription[] = []
		let hasMoreSubs = true
		let startingAfterSub: string | undefined

		while (hasMoreSubs) {
			const subBatch: Stripe.ApiList<Stripe.Subscription> =
				await stripe.subscriptions.list({
					limit: 100,
					starting_after: startingAfterSub,
					expand: ['data.customer', 'data.schedule'],
				})
			allSubscriptions = allSubscriptions.concat(subBatch.data)
			hasMoreSubs = subBatch.has_more
			if (hasMoreSubs) {
				startingAfterSub = subBatch.data[subBatch.data.length - 1].id
			}
		}

		// 3. Pre-fetch Client Names and Products
		const uniqueStripeCustomerIds = new Set([
			...allInvoices
				.map((i) =>
					typeof i.customer === 'string'
						? i.customer
						: i.customer?.id,
				)
				.filter(Boolean),
			...allSubscriptions
				.map((s) =>
					typeof s.customer === 'string'
						? s.customer
						: s.customer?.id,
				)
				.filter(Boolean),
		]) as Set<string>

		const clientNamesResult = await fetchClientNamesByStripeIds([
			...uniqueStripeCustomerIds,
		])
		const clientNamesMap = new Map<string, string>()
		if (clientNamesResult && !('errorMessage' in clientNamesResult)) {
			clientNamesResult.forEach((client) => {
				if (client.stripe_customer_id && client.full_name) {
					clientNamesMap.set(
						client.stripe_customer_id,
						client.full_name,
					)
				}
			})
		}

		// Fetch all products being used in subscriptions to get their names
		const uniqueProductIds = new Set<string>()
		allSubscriptions.forEach((sub) => {
			sub.items.data.forEach((item) => {
				if (typeof item.price.product === 'string') {
					uniqueProductIds.add(item.price.product)
				}
			})
		})

		const productMap = new Map<string, string>()
		await Promise.allSettled(
			[...uniqueProductIds].map(async (pid) => {
				try {
					const prod = await stripe.products.retrieve(pid)
					productMap.set(pid, prod.name)
				} catch (e) {
					console.error(`Error fetching product ${pid}:`, e)
				}
			}),
		)

		// 4. Calculate YTD Earnings per Client (from paid invoices in current year)
		const clientYtdMap = new Map<string, number>()
		allInvoices.forEach((invoice) => {
			const customerId =
				typeof invoice.customer === 'string'
					? invoice.customer
					: invoice.customer?.id
			if (
				customerId &&
				invoice.status === 'paid' &&
				invoice.created >= currentYearStart
			) {
				const amount = invoice.amount_paid / 100
				clientYtdMap.set(
					customerId,
					(clientYtdMap.get(customerId) || 0) + amount,
				)
			}
		})

		// 5. Transform and Filter Data
		const lowerSearch = searchTerm?.toLowerCase() || ''
		const items: BillingOverviewItem[] = []

		// 5a. Invoices
		allInvoices.forEach((invoice) => {
			const customerId =
				typeof invoice.customer === 'string'
					? invoice.customer
					: invoice.customer?.id
			if (!customerId || !clientNamesMap.has(customerId)) return

			const clientName = clientNamesMap.get(customerId) ?? 'Unknown'
			const description = invoice.lines.data
				.map((l) => l.description)
				.join(', ')

			const item: BillingOverviewItem = {
				id: invoice.id || 'no-id',
				type: 'invoice',
				date: invoice.created,
				client_name: clientName,
				customer_email: invoice.customer_email || '',
				status: invoice.status || 'unknown',
				amount: invoice.total / 100,
				description,
				ytd_earnings: clientYtdMap.get(customerId) || 0,
			}

			if (
				!lowerSearch ||
				item.client_name.toLowerCase().includes(lowerSearch) ||
				item.customer_email.toLowerCase().includes(lowerSearch) ||
				item.description.toLowerCase().includes(lowerSearch) ||
				item.id.toLowerCase().includes(lowerSearch)
			) {
				items.push(item)
			}
		})

		// 5b. Subscriptions
		const subItems: BillingOverviewItem[] = []
		await Promise.all(
			allSubscriptions.map(async (sub) => {
				const customerId =
					typeof sub.customer === 'string'
						? sub.customer
						: sub.customer?.id
				if (!customerId || !clientNamesMap.has(customerId)) return

				const clientName = clientNamesMap.get(customerId) ?? 'Unknown'
				const products = sub.items.data
					.map(
						(item) =>
							productMap.get(item.price.product as string) ||
							'Unknown Product',
					)
					.join(', ')

				let projected_total = 0
				if (sub.status === 'active' && sub.schedule) {
					try {
						const scheduleId =
							typeof sub.schedule === 'string'
								? sub.schedule
								: sub.schedule.id
						const schedule =
							await stripe.subscriptionSchedules.retrieve(
								scheduleId,
							)
						const lastPhase =
							schedule.phases[schedule.phases.length - 1]
						if (lastPhase?.end_date) {
							const periodsRemaining = Math.max(
								0,
								Math.ceil(
									(lastPhase.end_date - Date.now() / 1000) /
										(30 * 24 * 60 * 60),
								),
							)
							const monthlyAmount =
								sub.items.data.reduce(
									(acc, item) =>
										acc +
										(item.price.unit_amount || 0) *
											(item.quantity || 1),
									0,
								) / 100
							projected_total = monthlyAmount * periodsRemaining
						}
					} catch (e) {
						console.error(
							'Error retrieving schedule for projection',
							e,
						)
					}
				}

				const item: BillingOverviewItem = {
					id: sub.id,
					type: 'subscription',
					date: sub.start_date,
					client_name: clientName,
					customer_email:
						(sub.customer as Stripe.Customer).email || '',
					status: sub.status,
					amount:
						sub.items.data.reduce(
							(acc, item) =>
								acc +
								(item.price.unit_amount || 0) *
									(item.quantity || 1),
							0,
						) / 100,
					description: products,
					ytd_earnings: clientYtdMap.get(customerId) || 0,
					projected_total,
				}

				if (
					!lowerSearch ||
					item.client_name.toLowerCase().includes(lowerSearch) ||
					item.customer_email.toLowerCase().includes(lowerSearch) ||
					item.description.toLowerCase().includes(lowerSearch) ||
					item.id.toLowerCase().includes(lowerSearch)
				) {
					subItems.push(item)
				}
			}),
		)

		items.push(...subItems)

		// Sort by date DESC
		items.sort((a, b) => b.date - a.date)

		// 6. Pagination
		const totalItems = items.length
		const totalPages = Math.ceil(totalItems / pageSize)
		const paginatedItems = items.slice(
			(page - 1) * pageSize,
			page * pageSize,
		)

		// 7. Overall Stats (Re-calculate based on filtered clients only)
		const filteredCustomerIds = [...clientNamesMap.keys()]
		const totalYtdEarnings = filteredCustomerIds.reduce(
			(acc, cid) => acc + (clientYtdMap.get(cid) || 0),
			0,
		)
		const totalProjected = subItems.reduce(
			(acc, val) => acc + (val.projected_total || 0),
			0,
		)

		return {
			items: paginatedItems,
			totalPages,
			stats: {
				totalYtdEarnings,
				estimatedTotalYearEarnings: totalYtdEarnings + totalProjected,
			},
		}
	} catch (error) {
		console.error('Error fetching billing overview:', error)
		return { errorMessage: 'Failed to fetch billing overview data' }
	}
}
