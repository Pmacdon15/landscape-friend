'use server'
import {
	assignSnowClearingDb,
	unassignSnowClearingDb,
} from '@/lib/DB/clients-db'
import { isOrgAdmin } from '@/lib/utils/clerk'
import { schemaAssignSnow } from '../zod/schemas'

export async function assignSnowClearing(clientId: number, assignedTo: string) {
	const { isAdmin, orgId, userId } = await isOrgAdmin()
	if (!isAdmin) throw new Error('Not Admin')
	if (!orgId && !userId)
		throw new Error('Organization ID or User ID is missing.')

	const validatedFields = schemaAssignSnow.safeParse({
		clientId: clientId,
		assignedTo: assignedTo,
	})

	if (!validatedFields.success) throw new Error('Invalid input data')

	try {
		if (assignedTo === 'not-assigned') {
			const result = await unassignSnowClearingDb(
				validatedFields.data.clientId,
				orgId || String(userId),
			)
			return {
				...result,
				message: 'Successfully unassigned snow clearing',
			}
		} else {
			const result = await assignSnowClearingDb(
				validatedFields.data,
				orgId || String(userId),
			)
			if (!result) throw new Error('Failed to update Client cut day')
			return result
		}
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		throw new Error(errorMessage)
	}
}
