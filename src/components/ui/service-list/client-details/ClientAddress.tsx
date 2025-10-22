import React from 'react'
import Image from 'next/image'

interface ClientAddressProps {
	address: string
}

const ClientAddress: React.FC<ClientAddressProps> = ({ address }) => {
	return (
		<div className="flex w-full gap-2 items-center justify-center">
			<Image
				src="/client-list/address.png"
				alt="Address Icon"
				className="w-8 h-8"
				width={512}
				height={512}
			/>
			<p>Address: {address}</p>
		</div>
	)
}

export default ClientAddress
