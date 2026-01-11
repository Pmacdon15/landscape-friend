'use client'

import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import type { FetchBillingOverviewResponse } from '@/types/stripe-types'
import { DateDisplay } from '../date-display'
import { PaginationTabs } from '../pagination/pagination-tabs'

export function BillingOverviewTable({
	dataPromise,
	path,
}: {
	dataPromise: Promise<
		FetchBillingOverviewResponse | { errorMessage: string }
	>
	path: string
}) {
	const result = use(dataPromise)
	const router = useRouter()

	if ('errorMessage' in result) {
		return (
			<div className="rounded-lg bg-red-50 p-4 text-red-500">
				{result.errorMessage}
			</div>
		)
	}

	const { items, totalPages } = result

	const handleRowClick = (item: (typeof items)[0]) => {
		if (item.type === 'invoice') {
			router.push(`/billing/manage/invoices?search=${item.id}`)
		} else if (item.type === 'subscription') {
			router.push(`/billing/manage/subscriptions?search=${item.id}`)
		}
	}

	const handleClientClick = (e: React.MouseEvent, clientName: string) => {
		e.stopPropagation()
		router.push(`/lists/client?search=${encodeURIComponent(clientName)}`)
	}

	return (
		<div className="flex flex-col gap-4">
			{/* Mobile View - Card Layout */}
			<div className="min-[1390px]:hidden">
				{items.length === 0 ? (
					<div className="px-6 py-10 text-center text-gray-500 italic">
						No billing data found.
					</div>
				) : (
					<div className="space-y-4">
						{items.map((item) => (
							<div
								className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
								key={`${item.type}-${item.id}`}
								onClick={() => handleRowClick(item)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault()
										handleRowClick(item)
									}
								}}
								role="button"
								tabIndex={0}
							>
								<div className="flex items-center justify-between">
									<button
										className="cursor-pointer text-left font-medium text-gray-900 transition-colors hover:underline focus:outline-none"
										onClick={(e) =>
											handleClientClick(
												e,
												item.client_name,
											)
										}
										type="button"
									>
										{item.client_name}
									</button>
									<span
										className={`inline-flex items-center rounded-md px-2 py-0.5 font-medium text-xs ring-1 ring-inset ${
											['paid', 'active'].includes(
												item.status,
											)
												? 'bg-green-50 text-green-700 ring-green-600/20'
												: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
										}`}
									>
										{item.status.charAt(0).toUpperCase() +
											item.status.slice(1)}
									</span>
								</div>
								<div className="mt-2 text-sm text-gray-600">
									<div className="flex justify-between">
										<span>Date:</span>
										<span className="font-medium text-gray-900">
											<DateDisplay
												timestamp={item.date}
											/>
										</span>
									</div>
									<div className="flex justify-between">
										<span>Type:</span>
										<span
											className={`font-medium ${
												item.type === 'invoice'
													? 'text-blue-700'
													: 'text-purple-700'
											}`}
										>
											{item.type.charAt(0).toUpperCase() +
												item.type.slice(1)}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Amount:</span>
										<span className="font-semibold text-gray-900">
											$
											{item.amount.toLocaleString(
												undefined,
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												},
											)}
										</span>
									</div>
									<div className="flex justify-between">
										<span>YTD Earnings:</span>
										<span className="font-medium text-gray-600">
											$
											{item.ytd_earnings.toLocaleString(
												undefined,
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												},
											)}
										</span>
									</div>
									{item.projected_total !== undefined && (
										<div className="flex justify-between">
											<span>Projected Total:</span>
											<span className="font-bold text-blue-600">
												$
												{item.projected_total.toLocaleString(
													undefined,
													{
														minimumFractionDigits: 2,
														maximumFractionDigits: 2,
													},
												)}
											</span>
										</div>
									)}
								</div>
								<p
									className="mt-2 truncate text-sm text-gray-600"
									title={item.description}
								>
									{item.description}
								</p>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Desktop View - Table Layout */}
			<div className="hidden min-[1390px]:block overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
				<table className="w-full border-collapse text-left text-sm">
					<thead>
						<tr className="border-gray-200 border-b bg-gray-50/50">
							<th className="px-6 py-4 font-semibold text-gray-900 leading-tight">
								Date
							</th>
							<th className="px-6 py-4 font-semibold text-gray-900 leading-tight">
								Client
							</th>
							<th className="px-6 py-4 font-semibold text-gray-900 leading-tight">
								Type
							</th>
							<th className="px-6 py-4 font-semibold text-gray-900 leading-tight">
								Description
							</th>
							<th className="px-6 py-4 font-semibold text-gray-900 leading-tight">
								Status
							</th>
							<th className="px-6 py-4 font-semibold text-gray-900 leading-tight">
								Amount
							</th>
							<th className="px-6 py-4 font-semibold text-gray-900 leading-tight">
								YTD Earnings
							</th>
							<th className="whitespace-nowrap px-6 py-4 font-semibold text-gray-900 leading-tight">
								Projected Total
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{items.length === 0 ? (
							<tr>
								<td
									className="px-6 py-10 text-center text-gray-500 italic"
									colSpan={8}
								>
									No billing data found.
								</td>
							</tr>
						) : (
							items.map((item) => (
								<tr
									className="group cursor-pointer transition-colors hover:bg-gray-50/80 focus:bg-gray-50 focus:outline-none"
									key={`${item.type}-${item.id}`}
									onClick={() => handleRowClick(item)}
									onKeyDown={(e) => {
										if (
											e.key === 'Enter' ||
											e.key === ' '
										) {
											e.preventDefault()
											handleRowClick(item)
										}
									}}
									role="button"
									tabIndex={0}
								>
									<td className="px-6 py-4 text-gray-600">
										<DateDisplay timestamp={item.date} />
									</td>
									<td className="px-6 py-4">
										<div className="flex flex-col">
											<button
												className="cursor-pointer text-left font-medium text-gray-900 transition-colors hover:underline focus:outline-none group-hover:text-blue-600"
												onClick={(e) =>
													handleClientClick(
														e,
														item.client_name,
													)
												}
												type="button"
											>
												{item.client_name}
											</button>
											<span className="text-gray-500 text-xs">
												{item.customer_email}
											</span>
										</div>
									</td>
									<td className="px-6 py-4">
										<span
											className={`inline-flex items-center rounded-md px-2 py-0.5 font-medium text-xs ring-1 ring-inset ${
												item.type === 'invoice'
													? 'bg-blue-50 text-blue-700 ring-blue-600/20'
													: 'bg-purple-50 text-purple-700 ring-purple-600/20'
											}`}
										>
											{item.type.charAt(0).toUpperCase() +
												item.type.slice(1)}
										</span>
									</td>
									<td
										className="max-w-[200px] truncate px-6 py-4 text-gray-600"
										title={item.description}
									>
										{item.description}
									</td>
									<td className="px-6 py-4">
										<span
											className={`inline-flex items-center rounded-md px-2 py-0.5 font-medium text-xs ring-1 ring-inset ${
												['paid', 'active'].includes(
													item.status,
												)
													? 'bg-green-50 text-green-700 ring-green-600/20'
													: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
											}`}
										>
											{item.status
												.charAt(0)
												.toUpperCase() +
												item.status.slice(1)}
										</span>
									</td>
									<td className="px-6 py-4 font-semibold text-gray-900">
										$
										{item.amount.toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</td>
									<td className="px-6 py-4 font-medium text-gray-600">
										$
										{item.ytd_earnings.toLocaleString(
											undefined,
											{
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											},
										)}
									</td>
									<td className="px-6 py-4">
										{item.projected_total !== undefined ? (
											<span className="font-bold text-blue-600">
												$
												{item.projected_total.toLocaleString(
													undefined,
													{
														minimumFractionDigits: 2,
														maximumFractionDigits: 2,
													},
												)}
											</span>
										) : (
											<span className="text-gray-300">
												—
											</span>
										)}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
			<PaginationTabs
				fullWidth
				path={path as Route}
				totalPages={totalPages}
			/>
		</div>
	)
}
