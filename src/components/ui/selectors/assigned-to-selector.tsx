'use client'
import { useSearchParams } from 'next/navigation'
import { use } from 'react'
import { useSearch } from '@/lib/hooks/use-search'
import type { OrgMember } from '@/types/clerk-types'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../select'

export function AssignedToSelector({
	orgMembersPromise,
}: {
	orgMembersPromise?: Promise<OrgMember[] | { errorMessage: string }>
}) {
	const orgMembers = orgMembersPromise ? use(orgMembersPromise) : []

	const searchParams = useSearchParams()
	const { updateSearchParams } = useSearch()
	const assignedTo = searchParams.get('assigned') || ''
	function handleChange(value: string) {
		if (value === 'assigned_to')
		updateSearchParams('assigned', '')
	}
	return (
		<div className="flex gap-1">
			<Select
				defaultValue={assignedTo}
				name={'assigned_to'}
				// value={optimisticValue || 'none'}
				onValueChange={handleChange}
			>
				<SelectTrigger>
					<SelectValue placeholder="Assigned To" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value="assigned_to">Assigned To</SelectItem>
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
								'Error loading members'
							</SelectItem>
						)}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	)
}
