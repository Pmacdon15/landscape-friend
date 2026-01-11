'use client'

import { Calendar, DollarSign, TrendingUp } from 'lucide-react'
import { use } from 'react'
import type { FetchBillingOverviewResponse } from '@/types/stripe-types'

export function BillingStatsComponent({
	billingStatsPromise,
}: {
	billingStatsPromise: Promise<
		| FetchBillingOverviewResponse
		| {
				errorMessage: string
		  }
	>
}) {
	const result = use(billingStatsPromise)

	if ('errorMessage' in result) {
		return null
	}

	const { stats } = result

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div className="fade-in slide-in-from-bottom-4 relative animate-in overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-md">
				<div className="flex items-center gap-4">
					<div className="rounded-xl bg-green-50 p-3 text-green-600">
						<DollarSign className="h-6 w-6" />
					</div>
					<div>
						<p className="font-medium text-gray-500 text-sm uppercase tracking-wider">
							Total YTD Earnings
						</p>
						<h3 className="mt-1 font-bold text-3xl text-gray-900">
							$
							{stats.totalYtdEarnings.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</h3>
					</div>
				</div>
				<div className="absolute top-0 right-0 p-4">
					<TrendingUp className="-mr-4 -mt-4 h-20 w-20 rotate-12 text-green-50/50" />
				</div>
			</div>

			<div className="fade-in slide-in-from-bottom-4 relative animate-in overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-700 hover:shadow-md">
				<div className="flex items-center gap-4">
					<div className="rounded-xl bg-blue-50 p-3 text-blue-600">
						<Calendar className="h-6 w-6" />
					</div>
					<div>
						<p className="font-medium text-gray-500 text-sm uppercase tracking-wider">
							Estimated Total Year Earnings
						</p>
						<h3 className="mt-1 font-bold text-3xl text-gray-900">
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
				<p className="mt-4 font-medium text-gray-400 text-xs italic">
					* Based on current YTD and active subscription projections
				</p>
				<div className="absolute top-0 right-0 p-4">
					<TrendingUp className="-mr-4 -mt-4 h-20 w-20 rotate-12 text-blue-50/50" />
				</div>
			</div>
		</div>
	)
}
