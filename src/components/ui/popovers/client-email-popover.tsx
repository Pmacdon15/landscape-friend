'use client'
import * as Popover from '@radix-ui/react-popover'
import { useState } from 'react'
import SendEmailComponent from '@/components/ui/emails/send-email-component'

export const ClientEmailPopover = ({
	clientFullName,
	clientEmailAddress,
}: {
	clientFullName: string
	clientEmailAddress: string
}) => {
	const [open, setOpen] = useState(false)
	// const [emailSent, setEmailSent] = useState(false);

	const closePopOver = (success = true) => {
		if (success) {
			// setEmailSent(true);
			setTimeout(() => {
				setOpen(false)
				// setEmailSent(false);
			}, 800)
		} else {
			setOpen(false)
		}
	}

	return (
		<Popover.Root onOpenChange={setOpen} open={open}>
			<Popover.Trigger asChild>
				<button className="cursor-pointer text-blue-600 hover:underline">
					{clientEmailAddress}
				</button>
			</Popover.Trigger>
			<Popover.Content
				className="w-[90vw] md:w-5/6 max-h-[90vh] p-4 z-[9999]"
				sideOffset={4}
			>
				<div className="flex flex-col gap-4 ">
					<SendEmailComponent
						clientEmail={clientEmailAddress}
						clientName={clientFullName}
						onEmailSent={closePopOver}
						popover={true}
					/>
				</div>
			</Popover.Content>
		</Popover.Root>
	)
}
