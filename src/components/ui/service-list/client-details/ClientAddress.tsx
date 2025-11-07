import Image from 'next/image'
import type React from 'react'

interface ClientAddressProps {
	address: string
}

const ClientAddress: React.FC<ClientAddressProps> = ({ address }) => {
	return (
		<div className="flex w-full items-center justify-center gap-2">
			<Image
				alt="Address Icon"
				className="h-8 w-8"
				height={512}
				src="/client-list/address.png"
				width={512}
			/>
			<p>Address: {address}</p>
		</div>
	)
}

export default ClientAddress
