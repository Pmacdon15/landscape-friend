'use client'

import { useSearchParam } from '@/lib/hooks/hooks'
import { OrgMember } from '@/types/clerk-types'
import { use } from 'react'

export function AssignedToSelector({
	orgMembersPromise,
}: {
	orgMembersPromise?: Promise<OrgMember[]>
}) {
	const orgMembers = orgMembersPromise ? use(orgMembersPromise) : []
	const { currentValue, setParam } = useSearchParam('assigned', '')

	return (
		<div className="flex gap-1  ">
			<select
				name={'assigned_to'}
				className="w-fit border rounded-sm text-center py-2"
				value={currentValue}
				onChange={(e) => setParam(e.target.value)}
			>
				<option value="">Assigned To</option>
				{orgMembers.map((orgMember) => (
					<option
						key={orgMember.userId}
						value={orgMember.userId || ''}
					>
						{orgMember.userName}
					</option>
				))}
			</select>
			{orgMembers.length === 0 && <p>No members found</p>}
		</div>
	)
}
