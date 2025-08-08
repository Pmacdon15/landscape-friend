'use client'
import { useDebouncedMutation } from "@/hooks/hooks";
import { useUpdateClientPricePer } from "@/mutations/mutations";
import { Client } from "@/types/types";
import ReusableNumberInput from "../inputs/reusable-number-input";

export default function PricePerUpdateInput({ client, snow = false }: { client: Client, snow?: boolean }) {
    const { mutate, isPending, isError } = useUpdateClientPricePer();
    const debouncedMutate = useDebouncedMutation(mutate);

    return (
        <div className="flex">
            <p className=" my-auto w-30"> Price Per Cut: ${" "} </p>
            {snow ?

                <ReusableNumberInput
                    name="updated_price_per_month_snow"
                    defaultValue={client.price_per_month_snow || 51.5}
                    onChange={(value) => debouncedMutate({ clientId: client.id, pricePerCut: value, snow })}
                    disabled={isPending}
                />
                :
                < ReusableNumberInput
                    name="updated_price_per_cut"
                    defaultValue={client.price_per_cut || 51.5}
                    onChange={(value) => debouncedMutate({ clientId: client.id, pricePerCut: value })}
                    disabled={isPending}
                />
            }
            {isError && <span className="text-red-500">Error Updating Price</span>}
        </div>
    );
}