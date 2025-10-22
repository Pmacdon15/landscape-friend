import Image from 'next/image'
import Link from 'next/link'
import type React from 'react'

interface ClientPhoneNumberProps {
	phoneNumber: string
}

const ClientPhoneNumber: React.FC<ClientPhoneNumberProps> = ({
	phoneNumber,
}) => {
	return (
		<div className="flex w-full gap-2 items-center justify-center">
			<Image
				alt="Email Icon"
				className="w-8 h-8"
				height={512}
				src="/client-list/telephone.png"
				width={512}
			/>
			<p className="my-auto">Phone Number:</p>
			<Link
				className="cursor-pointer text-blue-600 hover:underline"
				href={`tel:${phoneNumber}`}
			>
				{phoneNumber}
			</Link>
		</div>
	)
}

export default ClientPhoneNumber
