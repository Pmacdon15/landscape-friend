import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ClientPhoneNumberProps {
  phoneNumber: string;
}

const ClientPhoneNumber: React.FC<ClientPhoneNumberProps> = ({ phoneNumber }) => {
  return (
    <div className="flex w-full gap-2 items-center justify-center">
      <Image
        src="/client-list/telephone.png"
        alt="Email Icon"
        className="w-8 h-8"
        width={512}
        height={512}
      />
      <p className="my-auto">Phone Number:</p>
      <Link className="cursor-pointer text-blue-600 hover:underline" href={`tel:${phoneNumber}`}>
        {phoneNumber}
      </Link>
    </div>
  );
};

export default ClientPhoneNumber;
