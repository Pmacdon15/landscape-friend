'use server'
import { revalidatePath, revalidateTag, updateTag } from 'next/cache'

export async function revalidatePathAction(path: string) {
	revalidatePath(`${path}`)
}

export async function revalidateTagAction(tag: string) {
	revalidateTag(tag, 'default')
}

export async function updateTagAction(tag: string) {
	await updateTag(tag)
}
