'use client'
import * as Popover from '@radix-ui/react-popover';
import SendEmailComponent from "@/components/ui/emails/send-email-component";
import { Client } from '@/types/types';
import { useState } from 'react';

export const ClientEmailPopover = ({ client }: { client: Client }) => {
    const [open, setOpen] = useState(false);
    // const [emailSent, setEmailSent] = useState(false);

    const closePopOver = (success = true) => {
        if (success) {
            // setEmailSent(true);
            setTimeout(() => {
                setOpen(false);
                // setEmailSent(false);
            }, 800);
        } else {
            setOpen(false);
        }
    };

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button className="cursor-pointer text-blue-600 hover:underline">
                    {client.email_address}
                </button>
            </Popover.Trigger>
            <Popover.Content
                className="w-[90vw] md:w-5/6 max-h-[90vh] p-4 "
                sideOffset={4}
            >
                <div className='flex flex-col gap-4'>

                    <SendEmailComponent
                        popover={true}
                        clientEmail={client.email_address}
                        clientName={client.full_name}
                        onEmailSent={closePopOver}
                    />
                </div>

            </Popover.Content>
        </Popover.Root>
    );
};