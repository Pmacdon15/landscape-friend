'use server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function revalidatePathAction(path: string) {
	revalidatePath(`${path}`)
}

export async function revalidateTagAction(tag: string) {
	revalidateTag(tag, 'default')
}
