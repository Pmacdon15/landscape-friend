import { Suspense } from 'react'
import type { ClientAssignment } from '@/types/assignment-types'
import type { OrgMember } from '@/types/clerk-types'
import type { ClientAddress } from '@/types/clients-types'
import type { ClientCuttingSchedule } from '@/types/schedules-types'
import { CuttingWeekDropDownContainer } from '../cutting-week/cutting-week'
import AssignedToFallback from '../fallbacks/assigned-to-fallback'
import AssignedTo from '../inputs/AssignedToSelect'
import { ViewSitePhotoSheet } from '../sheet/view-site-phots-sheet'

export default function AssignedToSection({
	addresses,
	assignments,
	schedules,
	orgMembersPromise,
}: {
	addresses: ClientAddress[]
	assignments: ClientAssignment[]
	schedules: ClientCuttingSchedule[]
	orgMembersPromise: Promise<OrgMember[] | { errorMessage: string }>
}) {
	return (
		<>
			{addresses.map((addr) => (
				<div
					className="flex flex-col flex-wrap items-center justify-center gap-4 border p-8 rounded-sm w-full md:w-4/6"
					key={`${addr.id} + addresses`}
				>
					<h1>{addr.address}</h1>
					<div className="flex flex-warp gap-4">
						<Suspense fallback={<AssignedToFallback />}>
							<AssignedTo
								addressId={addr.id}
								clientAssignedTo={
									assignments.find(
										(a) =>
											a.address_id === addr.id &&
											a.service_type === 'grass',
									)?.user_id ?? 'not-assigned'
								}
								orgMembersPromise={orgMembersPromise}
							/>
						</Suspense>
						<Suspense fallback={<AssignedToFallback />}>
							<AssignedTo
								addressId={addr.id}
								clientAssignedTo={
									assignments.find(
										(a) =>
											a.address_id === addr.id &&
											a.service_type === 'snow',
									)?.user_id ?? 'not-assigned'
								}
								orgMembersPromise={orgMembersPromise}
								snow
							/>
						</Suspense>
					</div>
					<CuttingWeekDropDownContainer
						addressId={addr.id}
						schedules={schedules}
					/>
					<ViewSitePhotoSheet addressId={addr.id} />
				</div>
			))}
		</>
	)
}
