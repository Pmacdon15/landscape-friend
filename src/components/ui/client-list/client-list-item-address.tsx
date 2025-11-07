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
		<div className="relative flex w-full flex-col items-center">
			<input
				checked={isExpanded}
				className="hidden"
				id={`map-toggle-${clientId}`}
				onChange={() => setIsExpanded(!isExpanded)}
				type="checkbox"
			/>
			<label
				className="flex w-full cursor-pointer flex-row items-center gap-2"
				htmlFor={`map-toggle-${clientId}`}
			>
				<Image
					alt="Address Icon"
					className="h-10 w-10"
					height={512}
					src="/client-list/address.png"
					width={512}
				/>
				<div className="-translate-x-1/2 absolute left-1/2 flex w-full flex-col items-center">
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
