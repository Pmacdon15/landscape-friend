import Image from 'next/image'
import { ClientEmailPopover } from '@/components/ui/popovers/client-email-popover'

const ClientListItemHeader = ({
	clientPhoneNumber,
}: {
	clientPhoneNumber: number
}) => {
	return (
		<div className="relative flex w-full flex-row items-center gap-2">
			<Image
				alt="Phone Icon"
				className="h-10 w-10"
				height={512}
				src="/client-list/telephone.png"
				width={512}
			/>
			<div className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center">
				<p className="text-sm">Phone Number:</p>
				<a
					className="cursor-pointer text-center hover:underline"
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
		<div className="relative flex w-full flex-row items-center gap-2">
			<Image
				alt="Email Icon"
				className="h-10 w-10"
				height={512}
				src="/client-list/email.png"
				width={512}
			/>
			<div className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center">
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
