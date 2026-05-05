import { put } from '@vercel/blob'
import { sql } from '@vercel/postgres'

export async function uploadImageBlob(
    addressId: number,
    file: File | Blob,
    orgId: string
): Promise<
    | { success: boolean; message: string; status: number }
    | { error: string; status: number }
> {
    if (!(file instanceof Blob)) {
        return { error: 'Invalid file type.', status: 400 }
    }

      const { url } = await put('map-drawing.png', file, {
        access: 'public',
        addRandomSuffix: true,
    })
  
    const sqlResults = await sql`
        INSERT INTO images (address_id, imageURL, isActive)
        SELECT ${addressId}, ${url}, true
        FROM addresses
        WHERE id = ${addressId} AND org_id = ${orgId}
        RETURNING *;
    `

    if (!sqlResults || sqlResults.rowCount === 0) {
        return { 
            error: 'Failed to upload. Address not found or unauthorized for this org.', 
            status: 403 
        }
    }

    return { success: true, message: 'Upload succeeded', status: 201 }
}

export async function uploadImageBlobServiceDone(
	file: File | Blob,
	isServiceImage = false,
): Promise<
	| { status: number; url: string }
	| { error: string; status: number; url: string }
> {
	if (!(file instanceof Blob)) {
		return { error: 'Invalid file type.', status: 400, url: '' }
	}

	const { url } = await put(
		`${isServiceImage ? 'serviced-image' : 'map-drawing'}.png`,
		file,
		{
			access: 'public',
			addRandomSuffix: true,
		},
	)
	return { status: 200, url: url }
}
