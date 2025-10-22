'use client'
import Image from 'next/image'
import { useState } from 'react'

export default function ClientListItemAddress({
	clientAddress,
	children,
}: {
	clientAddress: string
	children: React.ReactNode
}) {
	const [showMap, setShowMap] = useState(false)
	return (
		<div className="flex flex-col gap-2 items-center w-full">
			<button
				className="flex"
				onClick={() => setShowMap(!showMap)}
				type="button"
			>
				<Image
					alt="Address Icon"
					className="w-12 h-12"
					height={512}
					src="/client-list/address.png"
					width={512}
				/>
				<div className="flex flex-col ">
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
