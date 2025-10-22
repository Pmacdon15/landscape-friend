'use client'
import Image from 'next/image'
import { Activity, useState } from 'react'

interface ClientListItemAddressProps {
	clientId: number
	clientAddress: string
	children: React.ReactNode
}

export default function ClientListItemAddress({
	clientId,
	clientAddress,
	children,
}: ClientListItemAddressProps) {
	const [isExpanded, setIsExpanded] = useState(false)

	return (
		<div className="flex flex-col items-center w-full relative">
			<input
				checked={isExpanded}
				className="hidden"
				id={`map-toggle-${clientId}`}
				onChange={() => setIsExpanded(!isExpanded)}
				type="checkbox"
			/>
			<label
				className="flex flex-row gap-2 items-center cursor-pointer w-full"
				htmlFor={`map-toggle-${clientId}`}
			>
				<Image
					alt="Address Icon"
					className="w-10 h-10"
					height={512}
					src="/client-list/address.png"
					width={512}
				/>
				<div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2 w-full">
					<p className="text-sm">Address:</p>
					<p>{clientAddress}</p>
				</div>
			</label>
			<Activity mode={isExpanded ? 'visible' : 'hidden'}>
				{children}
			</Activity>
			{/* {isExpanded && <div className="w-full">{children}</div>} */}
		</div>
	)
}
