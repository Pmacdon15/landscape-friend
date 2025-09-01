'use client'
import { ClientListItemProps } from "@/types/types-clients";
import Image from "next/image";
import { useState } from "react";

export default function ClientListItemAddress({ client, children }: ClientListItemProps) {
    const [showMap, setShowMap] = useState(false)
    return (
        <div className="flex flex-row gap-2 items-start">
            <button onClick={() => setShowMap(!showMap)}>
                <Image
                    src="/client-list/address.png"
                    alt="Address Icon"
                    className="w-12 h-12"
                    width={512}
                    height={512}
                />
                <div className="flex flex-col">
                    <p className="text-sm">Address:</p>
                    <p>{client.address}</p>
                </div>
            </button>
            <div className={showMap ? "block" : "hidden"}>
                {children}
            </div>
        </div>
    );
};