import React from 'react';
import Image from 'next/image';
import { ClientEmailPopover } from '../../popovers/client-email-popover';

interface ClientEmailProps {
  clientEmailAddress: string;
  clientFullName: string;
}

const ClientEmail: React.FC<ClientEmailProps> = ({ clientEmailAddress, clientFullName }) => {
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
      <ClientEmailPopover clientFullName={clientFullName} clientEmailAddress={clientEmailAddress} />
    </div>
  );
};

export default ClientEmail;
