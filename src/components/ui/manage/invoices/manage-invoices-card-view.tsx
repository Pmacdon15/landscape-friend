'use client'
import type { StripeInvoice } from '@/types/stripe-types'
import ManageInvoiceButton from '../../buttons/manage-invoice-button'
import { DateDisplay } from '../../date-display'
import EditInvoiceLink from '../../links/edit-invoice-link'

export function CardView({ invoices }: { invoices: StripeInvoice[] }) {
	return (
		<div className="grid grid-cols-1 gap-4">
			{invoices.map((invoice) => (
				<div
					className="bg-white shadow-md rounded-lg p-4"
					key={invoice.id}
				>
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold">
							{invoice.client_name || invoice.customer_name}
						</h3>
						<span
							className={`px-2 py-1 text-xs font-semibold rounded-full ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
						>
							{invoice.status}
						</span>
					</div>
					<p className="text-sm text-gray-500">
						{invoice.customer_email}
					</p>
					<div className="mt-4">
						<p className="text-sm font-medium text-gray-700">
							Invoice Details
						</p>
						<div className="grid grid-cols-2 gap-2 mt-2 text-sm">
							<p>
								<span className="font-semibold">
									Amount Due:
								</span>{' '}
								${invoice.amount_due.toFixed(2)}
							</p>
							<p>
								<span className="font-semibold">Due Date:</span>{' '}
								<DateDisplay timestamp={invoice.due_date} />
							</p>
							<p>
								<span className="font-semibold">
									Created At:
								</span>{' '}
								<DateDisplay timestamp={invoice.created} />
							</p>
						</div>
					</div>
					<div className="mt-4">
						<p className="text-sm font-medium text-gray-700">
							Items
						</p>
						<ul className="mt-2 text-sm">
							{invoice.lines.data.map((item) => (
								<li
									className="flex justify-between"
									key={item.id}
								>
									<span>
										{item.description} (x{item.quantity})
									</span>
									<span>${item.amount.toFixed(2)}</span>
								</li>
							))}
						</ul>
					</div>
					{invoice.hosted_invoice_url && (
						<div className="mt-4">
							<a
								className="text-blue-500 hover:underline"
								href={invoice.hosted_invoice_url}
								rel="noopener noreferrer"
								target="_blank"
							>
								View Invoice
							</a>
						</div>
					)}
					<div className="flex flex-wrap justify-center w-full gap-4 mt-4">
						{invoice.status === 'draft' ? (
							<>
								<ManageInvoiceButton
									invoiceId={invoice.id}
									variant="send"
								/>
								<EditInvoiceLink invoiceId={invoice.id} />
							</>
						) : (
							invoice.status !== 'void' &&
							invoice.status !== 'paid' && (
								<ManageInvoiceButton
									invoiceId={invoice.id}
									variant="resend"
								/>
							)
						)}
						{invoice.status !== 'paid' &&
							invoice.status !== 'draft' &&
							invoice.status !== 'void' && (
								<>
									<ManageInvoiceButton
										invoiceId={invoice.id}
										variant="paid"
									/>
									<ManageInvoiceButton
										invoiceId={invoice.id}
										variant="void"
									/>
								</>
							)}
					</div>
				</div>
			))}
		</div>
	)
}
