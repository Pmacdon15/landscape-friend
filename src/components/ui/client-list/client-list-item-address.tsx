import Image from "next/image";
import { ReactNode } from "react";

const ClientListItemAddress = ({ clientId, clientAddress, children }: { clientId: number, clientAddress: string, children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center w-full relative">
      <input type="checkbox" id={`map-toggle-${clientId}`} className="hidden peer" />
      <label htmlFor={`map-toggle-${clientId}`} className="flex flex-row gap-2 items-center cursor-pointer w-full">
        <Image
          src="/client-list/address.png"
          alt="Address Icon"
          className="w-10 h-10"
          width={512}
          height={512}
        />
        <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2 w-full">
          <p className="text-sm">Address:</p>
          <p>{clientAddress}</p>
        </div>
      </label>
      <div className="hidden peer-checked:block w-full">
        {children}
      </div>
    </div>
  );
};
export default ClientListItemAddress;
