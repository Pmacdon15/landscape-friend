'use client'
import { useMarkYardCut } from "@/mutations/mutations";
import { Button } from "../button";

export default function MarkYardCut({ clientId, serviceDate }: { clientId: number, serviceDate: Date }) {
    const { mutate, isError, isPending } = useMarkYardCut();

    return (
        <>
            {isError && <p className="text-red-500">Error Marking Cut</p>}
            <Button variant={'outline'} onClick={() => mutate({ clientId, date: serviceDate })} disabled={isPending}>
                Mark Yard Cut
            </Button>
        </>
    );
}