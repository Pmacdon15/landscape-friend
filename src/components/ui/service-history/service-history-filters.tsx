import { Suspense } from 'react'
import type { OrgMember } from '@/types/clerk-types'
import { AssignedToSelectorFallback } from '../fallbacks/search/assigned-to-selector-fallback'
import { SearchInput } from '../inputs/search-input'
import { AssignedToSelector } from '../selectors/assigned-to-selector'
import { ServiceTypeSelector } from '../selectors/service-type-selector'
import { ServiceListDatePicker } from '../service-list/service-list-date-picker'

export default async function ServiceHistoryFilters({
	isAdminPromise,
	orgMembersPromise,
}: {
	isAdminPromise?: Promise<{ isAdmin: boolean }>
	orgMembersPromise?: Promise<OrgMember[] | { errorMessage: string }>
}) {
	const isAdmin = await isAdminPromise

	return (
		<div className="grid grid-cols-1 items-center justify-center gap-3 rounded-md bg-white/70 p-4 shadow-lg backdrop-blur-sm sm:grid-cols-2 lg:flex lg:flex-wrap">
			<div className="w-full lg:w-auto">
				<SearchInput />
			</div>

			<div className="w-full lg:w-auto">
				<ServiceTypeSelector />
			</div>

			<div className="w-full lg:w-auto">
				<ServiceListDatePicker allowEmptyDate={true} />
			</div>

			{isAdmin?.isAdmin && (
				<div className="w-full lg:w-auto">
					<Suspense fallback={<AssignedToSelectorFallback />}>
						<AssignedToSelector
							orgMembersPromise={orgMembersPromise}
						/>
					</Suspense>
				</div>
			)}
		</div>
	)
}
