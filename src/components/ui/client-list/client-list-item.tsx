import Image from "next/image";
import Link from "next/link";
import { ClientEmailPopover } from "@/components/ui/popovers/client-email-popover";
import { ClientListItemProps } from "@/types/types-clients";


const ClientListItemHeader = ({ client }: ClientListItemProps) => {
  return (
    <div className="flex flex-row gap-2 items-center w-full relative">
      <Image
        src="/client-list/telephone.png"
        alt="Phone Icon"
        className="w-10 h-10"
        width={512}
        height={512}
      />
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
        <p className="text-sm">Phone Number:</p>
        <Link className="cursor-pointer hover:underline text-center" href={`tel:${client.phone_number}`}>
          {client.phone_number}
        </Link>
      </div>
    </div>
  );
};

const ClientListItemEmail = ({ client }: ClientListItemProps) => {
  return (
    <div className="flex flex-row gap-2 relative items-center w-full">
      <Image
        src="/client-list/email.png"
        alt="Email Icon"
        className="w-10 h-10"
        width={512}
        height={512}
      />
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
        <p className="text-sm">Email:</p>
        <ClientEmailPopover client={client} />
      </div>
    </div>
  );
}


export { ClientListItemHeader, ClientListItemEmail };