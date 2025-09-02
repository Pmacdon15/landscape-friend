import React from 'react';
import Image from 'next/image';
import { Client } from '@/types/types-clients'; // Assuming Client type is needed
import { ClientEmailPopover } from '../../popovers/client-email-popover';

interface ClientEmailProps {
  client: Client;
}

const ClientEmail: React.FC<ClientEmailProps> = ({ client }) => {
  return (
    <div className="flex w-full gap-2 items-center justify-center">
      <Image
        src="/client-list/email.png"
        alt="Email Icon"
        className="w-8 h-8"
        width={512}
        height={512}
      />
      <p className="my-auto">Email:</p>
      <ClientEmailPopover client={client} />
    </div>
  );
};

export default ClientEmail;
