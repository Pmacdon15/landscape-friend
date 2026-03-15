'use server'

import { updateTag } from 'next/cache'
import { changePriorityDb } from '@/lib/DB/assignment-db'
import { isOrgAdmin } from '@/lib/utils/clerk'

export async function changePriority(assignmentId: number, priority: number) {
	const { userId } = await isOrgAdmin(true)
	if (!userId) throw new Error('Organization ID or User ID is missing.')

	try {
		await changePriorityDb(assignmentId, priority)
		updateTag('snow-clients')
	} catch (error) {
		console.error('Error changing priority:', error)
	}
}
