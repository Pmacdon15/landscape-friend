'use server'
import { changePriorityDb } from '../DB/assignment-db'
import { isOrgAdmin } from '../utils/clerk'

export async function changePriority(assignmentId: number, priority: number) {
	const { userId, orgId } = await isOrgAdmin()
	if (!userId) throw new Error('Organization ID or User ID is missing.')

	try {
		await changePriorityDb(orgId||userId, assignmentId, priority)
	} catch (error) {
		console.error('Error changing priority:', error)
	}
}
