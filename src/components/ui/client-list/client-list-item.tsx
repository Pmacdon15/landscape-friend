import Image from 'next/image'
import { ClientEmailPopover } from '@/components/ui/popovers/client-email-popover'

const ClientListItemHeader = ({
	clientPhoneNumber,
}: {
	clientPhoneNumber: string
}) => {
	return (
		<div className="flex flex-row gap-2 items-center w-full relative">
			<Image
				alt="Phone Icon"
				className="w-10 h-10"
				height={512}
				src="/client-list/telephone.png"
				width={512}
			/>
			<div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
				<p className="text-sm">Phone Number:</p>
				<a
					className="cursor-pointer hover:underline text-center"
					href={`tel:${clientPhoneNumber}`}
				>
					{clientPhoneNumber}
				</a>
			</div>
		</div>
	)
}

const ClientListItemEmail = ({
	clientFullName,
	clientEmailAddress,
}: {
	clientFullName: string
	clientEmailAddress: string
}) => {
	return (
		<div className="flex flex-row gap-2 relative items-center w-full">
			<Image
				alt="Email Icon"
				className="w-10 h-10"
				height={512}
				src="/client-list/email.png"
				width={512}
			/>
			<div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
				<p className="text-sm">Email:</p>
				<ClientEmailPopover
					clientEmailAddress={clientEmailAddress}
					clientFullName={clientFullName}
				/>
			</div>
		</div>
	)
}

export { ClientListItemHeader, ClientListItemEmail }
