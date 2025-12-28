import Image from 'next/image'
import type React from 'react'
import { useState } from 'react'
import MapComponent from '../../map-component/map-component'

interface ClientAddressProps {
	address: string
}

const ClientAddress: React.FC<ClientAddressProps> = ({ address }) => {
	const [isShowing, setIsShowing] = useState(false)
	return (
		<>
			<button
				className="flex w-full items-center justify-center gap-2"
				onClick={() => setIsShowing(!isShowing)}
				type="button"
			>
				<Image
					alt="Address Icon"
					className="h-8 w-8"
					height={512}
					src="/client-list/address.png"
					width={512}
				/>
				<p>Address: {address}</p>
			</button>
			{/* <Activity mode={isShowing ? 'visible' : 'hidden'}> */}
			{isShowing && <MapComponent address={address} />}
			{/* </Activity> */}
		</>
	)
}

export default ClientAddress
