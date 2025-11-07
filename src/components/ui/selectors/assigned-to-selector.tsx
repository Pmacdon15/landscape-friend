'use client'

import { use } from 'react'
import { useSearchParam } from '@/lib/hooks/hooks'
import type { OrgMember } from '@/types/clerk-types'

export function AssignedToSelector({
	orgMembersPromise,
}: {
	orgMembersPromise?: Promise<OrgMember[]>
}) {
	const orgMembers = orgMembersPromise ? use(orgMembersPromise) : []
	const { currentValue, setParam } = useSearchParam('assigned', '')

	return (
		<div className="flex gap-1">
			<select
				className="w-fit rounded-sm border py-2 text-center"
				name={'assigned_to'}
				onChange={(e) => setParam(e.target.value)}
				value={currentValue}
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
