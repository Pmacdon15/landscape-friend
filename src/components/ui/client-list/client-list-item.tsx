// ClientListItem.tsx
import Image from "next/image";
import Link from "next/link";
import { ClientEmailPopover } from "@/components/ui/popovers/client-email-popover";
import {  ClientListItemProps } from "@/types/types-clients";


const ClientListItemHeader = ({ client }: ClientListItemProps) => {
  return (
    <div className="flex flex-row gap-2 items-center justify-center">
      <Image
        src="/client-list/telephone.png"
        alt="Phone Icon"
        className="w-12 h-12"
        width={512}
        height={512}
      />
      <div className="flex flex-col w-full  items-center">
        <p className="text-sm mx-auto">Phone Number:</p>
        <Link className="cursor-pointer  hover:underline text-center" href={`tel:${client.phone_number}`}>
          {client.phone_number}
        </Link>
      </div>
    </div>
  );
};

const ClientListItemEmail = ({ client }: ClientListItemProps) => {
  return (
    <div className="flex flex-row gap-2 justify-center  items-center w-full ">
      <Image
        src="/client-list/email.png"
        alt="Email Icon"
        className="w-12 h-12"
        width={512}
        height={512}
      />
      <div className="flex flex-col">
        <p className="text-sm text-center">Email:</p>
        <ClientEmailPopover client={client} />
      </div>
    </div>
  );
};


export { ClientListItemHeader, ClientListItemEmail };