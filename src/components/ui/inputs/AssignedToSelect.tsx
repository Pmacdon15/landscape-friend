'use client'
import {
	useAssignGrassCutting,
	useAssignSnowClearing,
} from '@/lib/mutations/mutations'
import { use } from 'react'
import { OrgMember } from '@/types/clerk-types'

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
		<div className="flex gap-2 justify-center mb-2">
			<p className=" my-auto ">Assigned to {snow ? 'snow' : 'grass'}: </p>
			<select
				className="rounded-sm border md:w-3/6  w-3/6 p-1"
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
				{orgMembers &&
					orgMembers.map((member) => (
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
