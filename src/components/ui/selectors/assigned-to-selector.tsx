'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { use } from 'react'
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

	const router = useRouter()
	const searchParams = useSearchParams()
	const assignedTo = searchParams.get('assigned_to') || ''
	function handleChange(value: string) {
		if (value && value !== 'assigned_to') {
			router.push(`?assigned_to=${encodeURIComponent(value)}`)
		} else {
			router.push(`?`)
		}
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
