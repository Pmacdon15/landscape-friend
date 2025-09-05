'use client'
import { ClientListItemProps } from "@/types/clients-types";
import Image from "next/image";
import { useState } from "react";

export default function ClientListItemAddress({ client, children }: ClientListItemProps) {
    const [showMap, setShowMap] = useState(false)
    return (
        <div className="flex flex-col gap-2 items-center w-full">
            <button onClick={() => setShowMap(!showMap)} className="flex">
                <Image
                    src="/client-list/address.png"
                    alt="Address Icon"
                    className="w-12 h-12"
                    width={512}
                    height={512}
                />
                <div className="flex flex-col ">
                    <p className="text-sm">Address:</p>
                    <p>{client.address}</p>
                </div>
            </button>
            <div className={showMap ? "flex flex-col" : "hidden"}>
                {children}
            </div>
        </div>
    );
};

