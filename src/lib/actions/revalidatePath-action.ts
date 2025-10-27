'use server'
import { revalidatePath } from 'next/cache'

export async function revalidatePathAction(path: string) {
	revalidatePath(`${path}`)
}

export async function revalidateTagAction(tag: string) {
	revalidatePath(tag)
}
