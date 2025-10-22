import { del } from '@vercel/blob'
import type { BlobUrl } from '@/types/blob-types'
import { getClientsBlobsDB } from '../DB/clients-db'

export async function deleteClientsBlobs(orgId: string) {
	try {
		const blobUrls = await getClientsBlobsDB(orgId)

		if (blobUrls.length === 0) {
			console.log(`No blobs found for organization ${orgId}`)
			return
		}

		const batchUrls = blobUrls.map((blob: BlobUrl) => blob.url)
		await del(batchUrls)
		console.log(`Deleted blobs for organization ${orgId}`)
	} catch (error) {
		console.error(`Error deleting blobs for organization ${orgId}:`, error)
	}
}
