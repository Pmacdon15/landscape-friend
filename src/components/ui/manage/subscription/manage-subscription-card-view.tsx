import { fetchSubscriptions } from '@/lib/dal/stripe-dal'
import { parseClientListParams } from '@/lib/utils/params'
import CancelSubscriptionButton from '../../buttons/cancel-subscription-button'
import { DateDisplay } from '../../date-display'
import FormHeader from '../../header/form-header'
import { PaginationTabs } from '../../pagination/pagination-tabs'
export async function CardView({
	props,
}: {
	props: PageProps<'/billing/manage/subscriptions'>
}) {
	const searchParams = await props.searchParams
	const { searchTermStatus, page, searchTerm } =
		parseClientListParams(searchParams)
	const { subscriptions, totalPages } = await fetchSubscriptions(
		searchTermStatus,
		page,
		searchTerm,
	)
	return (
		<>
			<PaginationTabs
				fullWidth
				page={page}
				path={'/billing/manage/subscriptions'}
				totalPages={totalPages}
			/>
			<div className="grid grid-cols-1 gap-4">
				{subscriptions.length < 1 && (
					<FormHeader text={'No Subscriptions'} />
				)}
				{subscriptions.map((subscription) => {
					return (
						<div
							className="rounded-lg bg-white p-4 shadow-md"
							key={subscription.id}
						>
							<div className="flex items-center justify-between">
								<h3 className="font-semibold text-lg">
									{subscription.customer.name ||
										subscription.customer.email}
								</h3>
								<span
									className={`rounded-full px-2 py-1 font-semibold text-xs ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
								>
									{subscription.status}
								</span>
							</div>
							<p className="text-gray-500 text-sm">
								{subscription.customer.email}
							</p>
							<CancelSubscriptionButton
								subscriptionId={subscription.id}
							/>
							<div className="mt-4">
								<p className="font-medium text-gray-700 text-sm">
									Subscription Details
								</p>
								<div className="mt-2 grid grid-cols-2 gap-2 text-sm">
									<p>
										<span className="font-semibold">
											Created:
										</span>{' '}
										<DateDisplay
											timestamp={subscription.created}
										/>
									</p>
									<p>
										<span className="font-semibold">
											Status:
										</span>{' '}
										{subscription.status}
									</p>
								</div>
							</div>
							<div className="mt-4">
								<p className="font-medium text-gray-700 text-sm">
									Items
								</p>
								<ul className="mt-2 text-sm">
									{subscription.items.data.map((item) => (
										<li
											className="flex justify-between"
											key={item.id}
										>
											<span>
												{item.price.product} (x
												{item.quantity})
											</span>
											<span>
												$
												{(
													item.price.unit_amount / 100
												).toFixed(2)}
											</span>
										</li>
									))}
								</ul>
							</div>
							{subscription.subscription_schedule && (
								<div className="mt-4">
									<p className="font-medium text-gray-700 text-sm">
										Subscription Schedule
									</p>
									{subscription.subscription_schedule.phases.map(
										(phase, index) => (
											<p
												key={`${phase.start_date}-${phase.end_date}-${index}`}
											>
												<DateDisplay
													timestamp={phase.start_date}
												/>{' '}
												-{' '}
												<DateDisplay
													timestamp={phase.end_date}
												/>
											</p>
										),
									)}
								</div>
							)}
						</div>
					)
				})}
			</div>
			<PaginationTabs
				fullWidth
				page={page}
				path={'/billing/manage/subscriptions'}
				totalPages={totalPages}
			/>
		</>
	)
}
