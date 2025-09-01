import Image from "next/image";
import { ClientListItemProps } from "@/types/types-clients";
import { ReactNode } from "react";

const ClientListItemAddress = ({ client, children }: { client: ClientListItemProps['client'], children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <input type="checkbox" id={`map-toggle-${client.id}`} className="hidden peer" />
      <label htmlFor={`map-toggle-${client.id}`} className="flex flex-row gap-2 justify-center items-center cursor-pointer">
          <Image
            src="/client-list/address.png"
            alt="Address Icon"
            className="w-12 h-12"
            width={512}
            height={512}
          />
          <div className="flex flex-col items-center">
            <p className="text-sm text-center">Address:</p>
            <p className="text-center">{client.address}</p>
          </div>
      </label>
      <div className="hidden peer-checked:block w-full">
        {children}
      </div>
    </div>
  );
};

export default ClientListItemAddress;
