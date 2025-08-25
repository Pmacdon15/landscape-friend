'use client'
import { useUpdateStripeAPIKey } from "@/lib/mutations/mutations";
import { Button } from "../button";

export default function UpdateStripeApiKeyButton() {
    const { mutate, isPending, isError } = useUpdateStripeAPIKey();
    return (
        <>
            <Button variant={'outline'} formAction={mutate} disabled={isPending}>Update</Button>
            {isError && <p className="text-red-500">Error Updating API Key</p>}
        </>
    );
}