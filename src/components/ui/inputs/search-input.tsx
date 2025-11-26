'use client'

import { X } from 'lucide-react'
import { useSearchInput } from '@/lib/hooks/hooks'
import { Input } from '../input'

export function SearchInput() {
	const { searchTerm, setSearchTerm } = useSearchInput()

	return (
		<div className="relative sm:w-1/2 md:w-2/6">
			<Input
				className="w-full p-2 pr-8 focus:outline-none"
				name="search"
				onChange={(e) => setSearchTerm(e.target.value)}
				placeholder="Search"
				value={searchTerm}
			/>
			{searchTerm && (
				<button
					className="-translate-y-1/2 absolute top-1/2 right-2 rounded-sm p-0.5 text-gray-500 hover:border hover:text-gray-700"
					onClick={() => setSearchTerm('')}
					type="button"
				>
					<X size={16} />
				</button>
			)}
		</div>
	)
}
