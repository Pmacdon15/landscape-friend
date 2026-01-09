import { fetchQuotes } from '@/lib/dal/stripe-dal'
import { parseClientListParams } from '@/lib/utils/params'
import ManageQuoteButton from '../../buttons/manage-quote-button'
import { DateDisplay } from '../../date-display'
import { PaginationTabs } from '../../pagination/pagination-tabs'

export async function ManageQuoteCardView({
	props,
}: {
	props: PageProps<'/billing/manage/quotes'>
}) {
	const searchParams = await props.searchParams
	const { searchTermStatus, page, searchTerm } =
		parseClientListParams(searchParams)
	const { quotes, totalPages } = await fetchQuotes(
		searchTermStatus,
		page,
		searchTerm,
	)
	return (
		<>
			<PaginationTabs
				fullWidth				
				path={'/billing/manage/quotes'}
				totalPages={totalPages}
			/>
			<div className="grid grid-cols-1 gap-4">
				{quotes.map((quote) => (
					<div
						className="rounded-lg bg-white p-4 shadow-md"
						key={quote.id}
					>
						<div className="flex items-center justify-between">
							<h3 className="font-semibold text-lg">
								{quote.client_name || quote.customer_name}
							</h3>
							<span
								className={`rounded-full px-2 py-1 font-semibold text-xs ${quote.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
							>
								{quote.status}
							</span>
						</div>
						<div className="mt-4">
							<p className="font-medium text-gray-700 text-sm">
								Quote Details
							</p>
							<div className="mt-2 grid grid-cols-2 gap-2 text-sm">
								<p>
									<span className="font-semibold">
										Amount Total:
									</span>{' '}
									$
									{quote.amount_total !== null
										? (quote.amount_total / 100).toFixed(2)
										: 'N/A'}
								</p>
								<p>
									<span className="font-semibold">
										Created At:
									</span>{' '}
									{quote.created !== null ? (
										<DateDisplay
											timestamp={quote.created}
										/>
									) : (
										'N/A'
									)}
								</p>
								<p>
									<span className="font-semibold">
										Start Date:
									</span>{' '}
									{quote.metadata.startDate ? (
										<DateDisplay
											timestamp={quote.metadata.startDate}
										/>
									) : (
										'N/A'
									)}
								</p>
								<p>
									<span className="font-semibold">
										End Date:
									</span>{' '}
									{quote.metadata.endDate ? (
										<DateDisplay
											timestamp={quote.metadata.endDate}
										/>
									) : (
										'N/A'
									)}
								</p>
							</div>
						</div>
						<div className="mt-4">
							<p className="font-medium text-gray-700 text-sm">
								Items
							</p>
							<ul className="mt-2 text-sm">
								{quote.lines?.data.map((item) => (
									<li
										className="flex justify-between"
										key={item.id}
									>
										<span>
											{item.description} (x{item.quantity}
											)
										</span>
										<span>
											$
											{(
												item.amount * item.quantity
											).toFixed(2)}
										</span>
									</li>
								))}
							</ul>
						</div>
						<div className="mt-4 flex w-full flex-wrap justify-center gap-4">
							{quote.status === 'draft' && (
								<ManageQuoteButton
									action="edit"
									quoteId={quote.id}
								/>
							)}
							{quote.status === 'draft' && (
								<ManageQuoteButton
									action="send"
									quoteId={quote.id}
								/>
							)}
							{quote.status === 'open' && (
								<ManageQuoteButton
									action="accept"
									quoteId={quote.id}
								/>
							)}
							{quote.status === 'open' && (
								<ManageQuoteButton
									action="cancel"
									quoteId={quote.id}
								/>
							)}
						</div>
					</div>
				))}
			</div>
			<PaginationTabs
				fullWidth				
				path={'/billing/manage/quotes'}
				totalPages={totalPages}
			/>
		</>
	)
}
