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
							className="bg-white shadow-md rounded-lg p-4"
							key={subscription.id}
						>
							<div className="flex justify-between items-center">
								<h3 className="text-lg font-semibold">
									{subscription.customer.name ||
										subscription.customer.email}
								</h3>
								<span
									className={`px-2 py-1 text-xs font-semibold rounded-full ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
								>
									{subscription.status}
								</span>
							</div>
							<p className="text-sm text-gray-500">
								{subscription.customer.email}
							</p>
							<CancelSubscriptionButton
								subscriptionId={subscription.id}
							/>
							<div className="mt-4">
								<p className="text-sm font-medium text-gray-700">
									Subscription Details
								</p>
								<div className="grid grid-cols-2 gap-2 mt-2 text-sm">
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
								<p className="text-sm font-medium text-gray-700">
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
									<p className="text-sm font-medium text-gray-700">
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
