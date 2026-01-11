'use client'

import { Calendar, DollarSign, TrendingUp } from 'lucide-react'
import { use } from 'react'
import type { FetchBillingOverviewResponse } from '@/types/stripe-types'

export function BillingStatsComponent({
	dataPromise,
}: {
	dataPromise: Promise<
		FetchBillingOverviewResponse | { errorMessage: string }
	>
}) {
	const result = use(dataPromise)

	if ('errorMessage' in result) {
		return null
	}

	const { stats } = result

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
				<div className="flex items-center gap-4">
					<div className="rounded-xl bg-green-50 p-3 text-green-600">
						<DollarSign className="h-6 w-6" />
					</div>
					<div>
						<p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
							Total YTD Earnings
						</p>
						<h3 className="text-3xl font-bold text-gray-900 mt-1">
							$
							{stats.totalYtdEarnings.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</h3>
					</div>
				</div>
				<div className="absolute top-0 right-0 p-4">
					<TrendingUp className="h-20 w-20 text-green-50/50 -mr-4 -mt-4 rotate-12" />
				</div>
			</div>

			<div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-700">
				<div className="flex items-center gap-4">
					<div className="rounded-xl bg-blue-50 p-3 text-blue-600">
						<Calendar className="h-6 w-6" />
					</div>
					<div>
						<p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
							Estimated Total Year Earnings
						</p>
						<h3 className="text-3xl font-bold text-gray-900 mt-1">
							$
							{stats.estimatedTotalYearEarnings.toLocaleString(
								undefined,
								{
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								},
							)}
						</h3>
					</div>
				</div>
				<p className="mt-4 text-xs text-gray-400 font-medium italic">
					* Based on current YTD and active subscription projections
				</p>
				<div className="absolute top-0 right-0 p-4">
					<TrendingUp className="h-20 w-20 text-blue-50/50 -mr-4 -mt-4 rotate-12" />
				</div>
			</div>
		</div>
	)
}
