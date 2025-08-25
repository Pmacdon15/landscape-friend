'use client'
import { useMarkYardServiced } from "@/lib/mutations/mutations";
import { Button } from "../button";

export default function MarkYardServiced({ clientId, serviceDate, snow = false }: { clientId: number, serviceDate: Date, snow?: boolean }) {
    const { mutate, isError, isPending } = useMarkYardServiced();

    return (
        <>
            {isError && <p className="text-red-500">Error Marking Cut</p>}
            <Button variant={'outline'} onClick={() => mutate({ clientId, date: serviceDate, snow })} disabled={isPending}>
                Mark Yard Serviced
            </Button>
        </>
    );
}