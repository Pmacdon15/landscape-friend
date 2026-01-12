'use client'

import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import { X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSearch } from '@/lib/hooks/use-search'
import { Input } from '../input'

export function SearchInput() {
	const searchParams = useSearchParams()
	const { updateSearchParams } = useSearch()

	// Controlled state for the input
	const [value, setValue] = useState(searchParams.get('search') || '')

	// Debounced function to update URL
	const updateSearch = useDebouncedCallback(
		(next: string) => {
			updateSearchParams('search', next)
		},
		{ wait: 1000 },
	)

	// Sync URL changes to input (if URL changes externally)
	useEffect(() => {
		const param = searchParams.get('search') || ''
		setValue(param)
	}, [searchParams])

	const handleClear = () => {
		setValue('') // immediately clear input
		updateSearchParams('search', null) // immediately clear URL param
	}

	return (
		<div className="relative sm:w-1/2 md:w-2/6">
			<Input
				onChange={(e) => {
					const v = e.target.value
					setValue(v)
					updateSearch(v) // debounced update to URL
				}}
				placeholder="Search"
				value={value}
			/>

			{value && (
				<button
					className="absolute top-1/2 right-2 -translate-y-1/2"
					onClick={handleClear}
					type="button"
				>
					<X size={16} />
				</button>
			)}
		</div>
	)
}
