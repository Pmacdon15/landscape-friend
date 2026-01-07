'use client'
import Image from 'next/image'
import { useState } from 'react'

export default function ClientListItemAddress({
	clientAddress,
	children,
	key,
}: {
	clientAddress: string
	children: React.ReactNode
	key: number
}) {
	const [showMap, setShowMap] = useState(false)
	return (
		<div className="flex w-full flex-col items-center gap-2">
			<button
				className="flex"
				onClick={() => setShowMap(!showMap)}
				type="button"
			>
				<Image
					alt="Address Icon"
					className="h-12 w-12"
					height={512}
					src="/client-list/address.png"
					width={512}
				/>
				<div className="flex flex-col">
					<p className="text-sm">Address:</p>
					<p>{clientAddress}</p>
				</div>
			</button>
			<div className={showMap ? 'flex flex-col' : 'hidden'}>
				{children}
			</div>
		</div>
	)
}
