'use client'
import { useDebouncedMutation } from "@/hooks/hooks";
import { useUpdateClientPricePerCut } from "@/mutations/mutations";
import { Client } from "@/types/types";

export default function PricePerCutUpdateInput({ client }: { client: Client }) {
    const { mutate, isPending, isError } = useUpdateClientPricePerCut();
    const debouncedMutate = useDebouncedMutation(mutate);

    const handlePricePerCutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        debouncedMutate({ clientId: client.id, pricePerCut: Number(event.target.value) });
    };
    
    return (
        <p className="flex gap-1"> Price Per Cut: ${" "}
            <input
                className="w-2/6"
                name="updated_price_per_cut"
                type="number"
                defaultValue={client.price_per_cut || 51.5}
                onChange={handlePricePerCutChange}
                disabled={isPending}
            />
            {isError && <span className="text-red-500">Error Updating Price</span>}
        </p>
    );
}