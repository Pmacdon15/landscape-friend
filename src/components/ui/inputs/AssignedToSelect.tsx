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
	orgMembersPromise,
	addressId,
	snow = false,
}: {
	clientAssignedTo: string
	addressId: number
	orgMembersPromise?: Promise<OrgMember[] | { errorMessage: string }>
	snow?: boolean
}) {
	const { mutate: mutateAssignSnowClearing } = useAssignSnowClearing()
	const { mutate: mutateAssignGrassCutting } = useAssignGrassCutting()

	const orgMembers = use(orgMembersPromise ?? Promise.resolve([]))

	const defaultValue = clientAssignedTo ?? 'not-assigned'

	function handleChange(value: string) {
		if (snow) {
			mutateAssignSnowClearing({
				assignedTo: value,
				addressId: addressId,
			})
		} else {
			mutateAssignGrassCutting({
				assignedTo: value,
				addressId: addressId,
			})
		}
	}

	return (
		<div className="mb-2 flex justify-center gap-2">
			<p className="my-auto">Assigned to {snow ? 'snow' : 'grass'}: </p>
			<Select defaultValue={defaultValue} onValueChange={handleChange}>
				<SelectTrigger>
					<SelectValue placeholder="Not Assigned" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value="not-assigned">
							Not Assigned
						</SelectItem>
						{Array.isArray(orgMembers) ? (
							orgMembers.map((orgMember) => (
								<SelectItem
									key={orgMember.userId}
									value={orgMember.userId || ''}
								>
									{orgMember.userName}
								</SelectItem>
							))
						) : (
							<SelectItem disabled value="error">
								{'Error loading members'}
							</SelectItem>
						)}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	)
}
