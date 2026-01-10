'use client'

import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import { X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '../input'

export function SearchInput() {
	const router = useRouter()
	const searchParams = useSearchParams()

	const search = searchParams.get('search')

	const updateSearch = useDebouncedCallback(
		(next: string) => {
			if (next) {
				router.push(`?search=${encodeURIComponent(next)}`)
			} else {
				router.push(`?`)
			}
		},
		{ wait: 1000 },
	)

	return (
		<div className="relative sm:w-1/2 md:w-2/6">
			<Input
				defaultValue={search || ''}
				onChange={(e) => {
					const v = e.target.value
					// setValue(v)
					updateSearch(v)
				}}
				placeholder="Search"
			/>

			{search && (
				<button
					className="-translate-y-1/2 absolute top-1/2 right-2"
					onClick={() => {
						updateSearch('')
					}}
					type="button"
				>
					<X size={16} />
				</button>
			)}
		</div>
	)
}
