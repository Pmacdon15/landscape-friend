import { Suspense } from 'react'
import type { ClientAssignment } from '@/types/assignment-types'
import type { OrgMember } from '@/types/clerk-types'
import type { ClientAddress } from '@/types/clients-types'
import type { ClientCuttingSchedule } from '@/types/schedules-types'
import type { ClientSiteMapImages } from '@/types/site-maps-types'
import { CuttingWeekDropDownContainer } from '../cutting-week/cutting-week'
import AssignedToFallback from '../fallbacks/assigned-to-fallback'
import SiteMapImageList from '../image-list/site-map-image-list'
import AssignedTo from '../inputs/AssignedToSelect'
import { ViewSitePhotoSheet } from '../sheet/view-site-phots-sheet'

export default function AddressManagementSection({
	addresses,
	assignments,
	schedules,
	orgMembersPromise,
	isAdminPromise,
	pagePromise,
	siteMaps,
}: {
	addresses: ClientAddress[]
	assignments: ClientAssignment[]
	schedules: ClientCuttingSchedule[]
	orgMembersPromise: Promise<OrgMember[] | { errorMessage: string }>
	isAdminPromise: Promise<{ isAdmin: boolean }>
	pagePromise: Promise<number>
	siteMaps: ClientSiteMapImages[]
}) {
	return (
		<>
			{addresses.map((addr) => {
				const clientSiteMaps = siteMaps
					.filter((siteMap) => siteMap.address_id === addr.id)
					.map((siteMap) => ({
						id: siteMap.id,
						address_id: siteMap.address_id,
						imageURL: siteMap.imageURL,
						isActive: siteMap.isActive,
						client_id: siteMap.client_id,
						address: siteMap.address,
					}))
				return (
					<div
						className="flex w-full flex-col flex-wrap items-center justify-center gap-4 rounded-sm border p-8 md:w-4/6"
						key={`${addr.id} + addresses`}
					>
						<h1>{addr.address}</h1>
						<div className="flex flex-wrap gap-4">
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
						<Suspense>
							<SiteMapImageList
								addressId={addr.id}
								isAdminPromise={isAdminPromise}
								pagePromise={pagePromise}
								siteMaps={clientSiteMaps}
							/>
						</Suspense>
					</div>
				)
			})}
		</>
	)
}
