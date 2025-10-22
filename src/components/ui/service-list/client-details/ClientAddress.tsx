import Image from 'next/image'
import type React from 'react'

interface ClientAddressProps {
	address: string
}

const ClientAddress: React.FC<ClientAddressProps> = ({ address }) => {
	return (
		<div className="flex w-full gap-2 items-center justify-center">
			<Image
				alt="Address Icon"
				className="w-8 h-8"
				height={512}
				src="/client-list/address.png"
				width={512}
			/>
			<p>Address: {address}</p>
		</div>
	)
}

export default ClientAddress
