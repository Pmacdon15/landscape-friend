'use client'
import { use } from 'react'
import {
	useAssignGrassCutting,
	useAssignSnowClearing,
} from '@/lib/mutations/mutations'
import type { OrgMember } from '@/types/clerk-types'

export default function AssignedTo({
	clientAssignedTo,
	clientId,
	orgMembersPromise,
	snow = false,
}: {
	clientAssignedTo: string
	clientId: number
	orgMembersPromise?: Promise<OrgMember[]>
	snow?: boolean
}) {
	const { mutate: mutateAssignSnowClearing } = useAssignSnowClearing()
	const { mutate: mutateAssignGrassCutting } = useAssignGrassCutting()

	const orgMembers = use(orgMembersPromise ?? Promise.resolve([]))

	const defaultValue = clientAssignedTo ?? 'not-assigned'

	return (
		<div className="mb-2 flex justify-center gap-2">
			<p className="my-auto">Assigned to {snow ? 'snow' : 'grass'}: </p>
			<select
				className="w-3/6 rounded-sm border p-1 md:w-3/6"
				defaultValue={defaultValue}
				onChange={(e) => {
					const selectedUserId = e.target.value
					if (snow) {
						mutateAssignSnowClearing({
							clientId: clientId,
							assignedTo: selectedUserId,
						})
					} else {
						mutateAssignGrassCutting({
							clientId: clientId,
							assignedTo: selectedUserId,
						})
					}
				}}
			>
				<option value="not-assigned">Not Assigned</option>
				{orgMembers?.map((member) => (
					<option
						key={member.userId}
						value={member.userId.toString()}
					>
						{member.userName}
					</option>
				))}
			</select>
		</div>
	)
}
