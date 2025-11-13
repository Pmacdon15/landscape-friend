'use client'
import { use, useOptimistic, useTransition } from 'react'
import { useSearchParam } from '@/lib/hooks/hooks'
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
	orgMembersPromise?: Promise<OrgMember[]>
}) {
	const orgMembers = orgMembersPromise ? use(orgMembersPromise) : []
	const { currentValue, setParam } = useSearchParam('assigned', '')
	const [optimisticValue, setOptimisticValue] = useOptimistic(
		currentValue,
		(_, newValue: string) => newValue,
	)
	const [, startTransition] = useTransition()

	function handleChange(value: string) {
		startTransition(() => {
			const newValue = value === 'none' ? '' : value;
			setOptimisticValue(newValue)
			setParam(newValue)
		})
	}

	return (
		<div className="flex gap-1">
			<Select
				name={'assigned_to'}
				onValueChange={handleChange}
				value={optimisticValue || 'none'}
			>
				<SelectTrigger>
					<SelectValue placeholder="Assigned To" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value="none">Assigned To</SelectItem>
						{orgMembers.map((orgMember) => (
							<SelectItem
								key={orgMember.userId}
								value={orgMember.userId || ''}
							>
								{orgMember.userName}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			{orgMembers.length === 0 && <p>No members found</p>}
		</div>
	)
}