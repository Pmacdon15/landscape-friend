'use server'
import {
	assignGrassCuttingDb,
	unassignGrassCuttingDb,
} from '../DB/assignment-db'
import { markYardServicedDb, saveUrlImagesServices } from '../DB/clients-db'
import { isOrgAdmin } from '../utils/clerk'
import { uploadImageBlobServiceDone } from '../utils/image-control'
import { schemaAssign, schemaMarkYardCut } from '../zod/schemas'

export async function markYardServiced(
	addressId: number,
	date: Date,
	snow = false,
	images: File[],
) {
	const {  userId } = await isOrgAdmin(true)

	if (!userId) return { errorMessage: 'User ID is missing.' }

	const validatedFields = schemaMarkYardCut.safeParse({
		addressId: addressId,
		date: date,
	})

	if (!validatedFields.success) return { errorMessage: 'Invalid input data' }
	// if (isTrue) return { errorMessage: 'Invalid input data' }

	const images_url = []
	const result_upload = []
	/// Try upload Image to Vercel Blob
	try {
		for (let i = 0; i < images.length; i++) {
			result_upload[i] = await uploadImageBlobServiceDone(images[i], true)
			images_url[i] = result_upload[i].url
		}
		if (!result_upload)
			return {
				errorMessage: 'Failed to mark client serviced',
			}
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		console.error(
			'Error marking yard serviced, Image upload failed: ',
			errorMessage,
		)
		return { errorMessage: 'Error marking yard serviced.' }
	}

	// Try save information into Database
	try {
		const inserted_record = await markYardServicedDb(
			validatedFields.data,
			snow,
			userId,
		)

		if (!inserted_record || inserted_record.length === 0) {
			console.error(
				'Failed to mark yard serviced: No record returned from DB',
			)
			return { errorMessage: 'Failed to update client as serviced' }
		}

		const result_mark_id = inserted_record[0].id

		const result_url = []
		for (let i = 0; i < images.length; i++) {
			result_url[i] = await saveUrlImagesServices(
				snow,
				images_url[i],
				result_mark_id,
			)
		}

		if (!result_url)
			return { errorMessage: 'Failed to update client serviced' }
		return { success: true }
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		console.error(
			'Error marking yard serviced, failed DB insertion: ',
			errorMessage,
		)
		return { errorMessage: 'Failed to update client serviced' }
	}
}

export async function assignGrassCutting(
	assignedTo: string,
	addressId: number,
) {
	const { isAdmin, orgId, userId } = await isOrgAdmin(true)
	if (!isAdmin) throw new Error('Not Admin')
	if (!orgId && !userId)
		throw new Error('Organization ID or User ID is missing.')

	const validatedFields = schemaAssign.safeParse({
		addressId: addressId,
		assignedTo: assignedTo,
	})

	if (!validatedFields.success) throw new Error('Invalid input data')

	try {
		if (assignedTo === 'not-assigned') {
			const result = await unassignGrassCuttingDb(addressId)
			if (!result) throw new Error('Failed to unassign grass cutting')
			return result
		} else {
			const result = await assignGrassCuttingDb(
				validatedFields.data,
				addressId,
			)
			if (!result) throw new Error('Failed to update Client cut day')
			return result
		}
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		throw new Error(errorMessage)
	}
}
