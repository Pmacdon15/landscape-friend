'use server'
import { revalidatePath } from 'next/cache'
import { isOrgAdmin } from '@/lib/utils/clerk'
import { uploadImageBlob } from '@/lib/utils/image-control'
import { ImageSchema } from '@/lib/zod/schemas'

export async function uploadImage(
	customerId: number,
	formData: FormData,
): Promise<
	| { success: boolean; message: string; status: number }
	| { error: string; status: number }
	| { error: { image: string[] | undefined }; status: number }
	| Error
	| null
> {
	const { isAdmin, userId, orgId } = await isOrgAdmin()
	if (!isAdmin) return new Error('Not Admin')
	if (!userId) return new Error('No Id')

	let result:
		| { success: boolean; message: string; status: number }
		| { error: string; status: number }

	try {
		const image = formData.get('image')
		const validatedImage = ImageSchema.safeParse({ image })

		if (!validatedImage.success) throw new Error('invalid inputs')

		result = await uploadImageBlob(
			orgId || userId,
			customerId,
			validatedImage.data.image,
		)
		if (result && 'error' in result) {
			throw new Error(result.error)
		}
	} catch (e) {
		if (e instanceof Error) return e
		else return new Error('An unknown error occurred')
	}
	revalidatePath('/lists/client')
	revalidatePath('/lists/cutting')
	revalidatePath('/lists/clearing')
	return result
}

export async function uploadDrawing(
	file: Blob,
	clientId: number,
): Promise<
	| { success: boolean; message: string; status: number }
	| { error: string; status: number }
	| Error
	| null
> {
	const { isAdmin, userId, orgId } = await isOrgAdmin()
	if (!isAdmin) return new Error('Not Admin')

	// Check if the file is an image
	if (!file.type.startsWith('image/')) {
		return {
			error: 'Invalid file type. Only images are allowed.',
			status: 400,
		}
	}

	// Check the file size
	const maxSize = 10 * 1024 * 1024 // 10MB
	if (file.size > maxSize) {
		return {
			error: 'File size exceeds the maximum allowed size of 10MB.',
			status: 400,
		}
	}

	let result:
		| { success: boolean; message: string; status: number }
		| { error: string; status: number }

	try {
		result = await uploadImageBlob(orgId || String(userId), clientId, file)
		if (result && 'error' in result) {
			throw new Error(result.error)
		}
	} catch (e) {
		if (e instanceof Error) return e
		else return new Error('An unknown error occurred')
	}
	revalidatePath('/lists/client')
	revalidatePath('/lists/cutting')
	revalidatePath('/lists/clearing')
	return result
}
