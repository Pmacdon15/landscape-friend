'use client'
import { useDebouncedMutation } from "@/lib/hooks/hooks";
import { useUpdateClientPricePer } from "@/mutations/mutations";
import ReusableNumberInput from "../inputs/reusable-number-input";
import { Client } from "@/types/types-clients";

export default function PricePerUpdateInput({ client, snow = false }: { client: Client, snow?: boolean }) {
    const { mutate, isPending, isError } = useUpdateClientPricePer();
    const debouncedMutate = useDebouncedMutation(mutate);
    
    return (
        <div className="flex">

            {snow ?
                <div className="flex">
                    <p className=" my-auto w-40"> Snow service Price: $  </p>
                    <ReusableNumberInput
                        name="updated_price_per_month_snow"
                        defaultValue={client.price_per_month_snow}
                        onChange={(value) => debouncedMutate({ clientId: client.id, pricePerCut: value, snow })}
                        disabled={isPending}
                    />
                </div>
                :
                <div className="flex">
                    <p className=" my-auto w-40"> Price Per Cut: ${" "} </p>
                    < ReusableNumberInput
                        name="updated_price_per_cut"
                        defaultValue={client.price_per_cut || 51.5}
                        onChange={(value) => debouncedMutate({ clientId: client.id, pricePerCut: value, snow })}
                        disabled={isPending}
                    />
                </div>
            }
            {isError && <span className="text-red-500">Error Updating Price</span>}
        </div>
    );
}