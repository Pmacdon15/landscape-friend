'use client'

import type { Route } from 'next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export const useSearch = () => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const updateSearchParams = (key: string, value: string | null) => {
		const params = new URLSearchParams(searchParams.toString())
		if (value && value !== '' && value !== 'none') {
			params.set(key, value)
		} else {
			params.delete(key)
		}
		const fullPath = `${pathname}?${params.toString()}`

		// Cast the entire string to Route
		router.push(fullPath as Route)
	}

	return { updateSearchParams }
}
