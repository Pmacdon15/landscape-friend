import Image from 'next/image'
import type React from 'react'
import { ClientEmailPopover } from '../../popovers/client-email-popover'

interface ClientEmailProps {
	clientEmailAddress: string
	clientFullName: string
}

const ClientEmail: React.FC<ClientEmailProps> = ({
	clientEmailAddress,
	clientFullName,
}) => {
	return (
		<div className="flex w-full gap-2 items-center justify-center">
			<Image
				alt="Email Icon"
				className="w-8 h-8"
				height={512}
				src="/client-list/email.png"
				width={512}
			/>
			<p className="my-auto">Email:</p>
			<ClientEmailPopover
				clientEmailAddress={clientEmailAddress}
				clientFullName={clientFullName}
			/>
		</div>
	)
}

export default ClientEmail
