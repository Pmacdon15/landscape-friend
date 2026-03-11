'use client'

import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import { Search, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSearch } from '@/lib/hooks/use-search'
import { Input } from '../input'

export function SearchInput() {
	const searchParams = useSearchParams()
	const { updateSearchParams } = useSearch()
	const [value, setValue] = useState(searchParams.get('search') || '')

	const updateSearch = useDebouncedCallback(
		(next: string) => {
			updateSearchParams('search', next)
		},
		{ wait: 1000 },
	)

	useEffect(() => {
		const param = searchParams.get('search') || ''
		setValue(param)
	}, [searchParams])

	const handleClear = () => {
		setValue('')
		updateSearchParams('search', null)
	}

	return (
		<div className="group relative w-full">
			<div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
				<Search size={18} />
			</div>

			<Input
				className="h-10 w-full border-none bg-white/50 pr-10 pl-10 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/50"
				onChange={(e) => {
					const v = e.target.value
					setValue(v)
					updateSearch(v)
				}}
				placeholder="Search clients..."
				value={value}
			/>

			{value && (
				<button
					className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-all hover:bg-black/5"
					onClick={handleClear}
					type="button"
				>
					<X size={16} />
				</button>
			)}
		</div>
	)
}
