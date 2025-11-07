import { fetchInvoices } from '@/lib/dal/stripe-dal'
import { parseClientListParams } from '@/lib/utils/params'
import ManageInvoiceButton from '../../buttons/manage-invoice-button'
import { DateDisplay } from '../../date-display'
import EditInvoiceLink from '../../links/edit-invoice-link'
import { PaginationTabs } from '../../pagination/pagination-tabs'

export async function CardView({
	props,
}: {
	props: PageProps<'/billing/manage/invoices'>
}) {
	const searchParams = await props.searchParams

	const { searchTermStatus, page, searchTerm } =
		parseClientListParams(searchParams)

	const { invoices, totalPages } = await fetchInvoices(
		searchTermStatus,
		page,
		searchTerm,
	)

	return (
		<>
			<PaginationTabs
				fullWidth
				page={page}
				path={'/billing/manage/invoices'}
				totalPages={totalPages}
			/>
			<div className="grid grid-cols-1 gap-4">
				{invoices.map((invoice) => (
					<div
						className="rounded-lg bg-white p-4 shadow-md"
						key={invoice.id}
					>
						<div className="flex items-center justify-between">
							<h3 className="font-semibold text-lg">
								{invoice.client_name || invoice.customer_name}
							</h3>
							<span
								className={`rounded-full px-2 py-1 font-semibold text-xs ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
							>
								{invoice.status}
							</span>
						</div>
						<p className="text-gray-500 text-sm">
							{invoice.customer_email}
						</p>
						<div className="mt-4">
							<p className="font-medium text-gray-700 text-sm">
								Invoice Details
							</p>
							<div className="mt-2 grid grid-cols-2 gap-2 text-sm">
								<p>
									<span className="font-semibold">
										Amount Due:
									</span>{' '}
									${invoice.amount_due.toFixed(2)}
								</p>
								<p>
									<span className="font-semibold">
										Due Date:
									</span>{' '}
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
							<p className="font-medium text-gray-700 text-sm">
								Items
							</p>
							<ul className="mt-2 text-sm">
								{invoice.lines.data.map((item) => (
									<li
										className="flex justify-between"
										key={item.id}
									>
										<span>
											{item.description} (x{item.quantity}
											)
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
						<div className="mt-4 flex w-full flex-wrap justify-center gap-4">
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
			<PaginationTabs
				fullWidth
				page={page}
				path={'/billing/manage/invoices'}
				totalPages={totalPages}
			/>
		</>
	)
}
