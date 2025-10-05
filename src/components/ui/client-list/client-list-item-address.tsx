'use client'
import Image from "next/image";
import { Activity, useState } from "react";

interface ClientListItemAddressProps {
  clientId: number;
  clientAddress: string;
  children: React.ReactNode;
}

export default function ClientListItemAddress({ clientId, clientAddress, children }: ClientListItemAddressProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center w-full relative">
      <input
        type="checkbox"
        id={`map-toggle-${clientId}`}
        className="hidden"
        checked={isExpanded}
        onChange={() => setIsExpanded(!isExpanded)}
      />
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
      <Activity mode={isExpanded  ? 'visible' : 'hidden'}>{children}</Activity>
      {/* {isExpanded && <div className="w-full">{children}</div>} */}
    </div>
  );
}