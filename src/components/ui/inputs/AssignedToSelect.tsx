'use client'
import { use } from 'react'
import {
	useAssignGrassCutting,
	useAssignSnowClearing,
} from '@/lib/mutations/mutations'
import type { OrgMember } from '@/types/clerk-types'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../select'

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

		function handleChange(value: string) {
		if (snow) {
			mutateAssignSnowClearing({
				clientId: clientId,
				assignedTo: value ,
			})
		} else {
			mutateAssignGrassCutting({
				clientId: clientId,
				assignedTo: value ,
			})
		}
	}

	return (
		<div className="mb-2 flex justify-center gap-2">
			<p className="my-auto">Assigned to {snow ? 'snow' : 'grass'}: </p>
			<Select
				defaultValue={defaultValue}
				onValueChange={handleChange}
			>
				<SelectTrigger>
					<SelectValue placeholder="Not Assigned" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value="not-assigned">Not Assigned</SelectItem>
						{orgMembers?.map((member) => (
							<SelectItem
								key={member.userId}
								value={member.userId.toString()}
							>
								{member.userName}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	)
}