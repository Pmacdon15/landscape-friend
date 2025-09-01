'use client';

import Image from "next/image";
import { ClientListItemProps } from "@/types/types-clients";
import { ReactNode, useState } from "react";

const ClientListItemAddress = ({ client, children }: { client: ClientListItemProps['client'], children: ReactNode }) => {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-row gap-2 justify-center items-center cursor-pointer" onClick={() => setShowMap(!showMap)}>
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
      </div>
      {showMap && children}
    </div>
  );
};

export default ClientListItemAddress;