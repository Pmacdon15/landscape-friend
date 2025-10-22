import { neon } from '@neondatabase/serverless'
import Stripe from 'stripe'
import { fetchClientIdByStripeCustomerId, markPaidDb } from '../DB/clients-db'

export async function handleInvoicePaid(
	invoicePaid: Stripe.Invoice,
	orgId: string,
) {
	console.log('Payment received for invoice:', invoicePaid.id)

	if (invoicePaid.id && invoicePaid.customer) {
		const markPaidResult = await markPaidDb(
			invoicePaid.id,
			String(invoicePaid.customer),
			invoicePaid.amount_paid,
			orgId,
		)
		if (markPaidResult.success) {
			console.log(
				`Successfully marked invoice ${invoicePaid.id} as paid in DB. New balance: ${markPaidResult.newBalance}`,
			)
		} else {
			console.error(
				`Failed to mark invoice ${invoicePaid.id} as paid in DB: ${markPaidResult.message}`,
			)
		}
	} else {
		console.error(
			`Missing customer ID or amount paid for invoice.paid event: ${invoicePaid.id}`,
		)
	}
}
export async function handleInvoiceSent(
	invoice: Stripe.Invoice,
	orgId: string,
) {
	console.log('Invoice sent:', invoice.id)
	console.log('Customer:', invoice.customer_email || invoice.customer)
	console.log('Amount Due:', invoice.amount_due / 100, invoice.currency)

	const sql = neon(`${process.env.DATABASE_URL}`)

	try {
		const customerId = invoice.customer as string
		const amountDue = invoice.amount_due
		const currency = invoice.currency
		const invoiceId = invoice.id

		if (!customerId || amountDue === undefined || !invoiceId) {
			console.error(
				`Missing customer ID, amount due, or invoice ID for invoice.sent event: ${invoice.id}`,
			)
			return
		}

		const clientId = await fetchClientIdByStripeCustomerId(
			customerId,
			orgId,
		)

		if (!clientId) {
			console.error(
				`Client not found for Stripe Customer ID: ${customerId} in organization: ${orgId}`,
			)
			return
		}

		const result = await sql`
      WITH inserted_charge AS (
        INSERT INTO charges(invoice_id, client_id, amount, currency, organization_id)
        VALUES (${invoiceId}, ${clientId}, ${amountDue / 100}, ${currency}, ${orgId})
        ON CONFLICT (invoice_id) DO NOTHING
        RETURNING id
      )
      UPDATE accounts
      SET current_balance = current_balance + ${amountDue / 100}
      FROM clients
      WHERE accounts.client_id = clients.id
      AND clients.id = ${clientId}
      RETURNING accounts.current_balance AS new_balance, (SELECT id FROM inserted_charge) AS charge_id;
    `

		if (!result || result.length === 0) {
			console.log(
				`Invoice ${invoiceId} already processed or failed to process.`,
			)
			return
		}

		const { new_balance, charge_id } = result[0]
		console.log(
			`Invoice ${invoiceId} processed. New balance: ${new_balance}, Charge ID: ${charge_id}`,
		)
	} catch (e) {
		console.error('Unexpected error handling invoice.sent event:', e)
	}
}
