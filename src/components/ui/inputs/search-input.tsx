'use client'

import { X } from 'lucide-react'
import { useSearchInput } from '@/lib/hooks/hooks'
import { Input } from '../input'

export function SearchInput() {
	const { searchTerm, setSearchTerm } = useSearchInput()

	return (
		<div className="flex items-center sm:w-1/2 md:w-2/6">
			<Input
				className="grow p-2 focus:outline-none"
				name="search"
				onChange={(e) => setSearchTerm(e.target.value)}
				placeholder="Search"
				value={searchTerm}
			/>
			{searchTerm && (
				<button
					className="p-2 text-gray-500 hover:text-gray-700"
					onClick={() => setSearchTerm('')}
					type="button"
				>
					<X size={16} />
				</button>
			)}
		</div>
	)
}
