'use client'
import { useMarkYardCut } from "@/mutations/mutations";
import { Button } from "../button";

export default function MarkYardCut({ clientId, cuttingDate }: { clientId: number, cuttingDate: Date }) {
    const { mutate, isError } = useMarkYardCut();

    return (
        <>
            {isError && <p className="test-red-500">Error Marking Cut</p>}
            <Button variant={'outline'} onClick={() => mutate({ clientId, date: cuttingDate })}>
                Mark Yard Cut
            </Button>
        </>
    );
}