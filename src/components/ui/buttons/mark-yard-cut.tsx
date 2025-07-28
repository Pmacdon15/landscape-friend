'use client'
import { useMarkYardCut } from "@/mutations/mutations";
import { Button } from "../button";

export default function MarkYardCut({ clientId, cuttingDate }: { clientId: number, cuttingDate: Date }) {
    const { mutate, isError, isPending } = useMarkYardCut();

    return (
        <>
            {isError && <p className="text-red-500">Error Marking Cut</p>}
            <Button variant={'outline'} onClick={() => mutate({ clientId, date: cuttingDate })} disabled={isPending}>
                Mark Yard Cut
            </Button>
        </>
    );
}