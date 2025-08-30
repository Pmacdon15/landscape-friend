'use client'
import { useUpdateStripeAPIKey } from "@/lib/mutations/mutations";
import { Button } from "../button";
import Spinner from "../loaders/spinner";

export default function UpdateStripeApiKeyButton() {
    const { mutate, isPending, isError } = useUpdateStripeAPIKey();
    return (
        <>
            <Button variant={'outline'} formAction={mutate} disabled={isPending}>{isPending ? <>Updating...<Spinner /></> : "Update"}</Button>
            {isError && <p className="text-red-500">Error Updating API Key</p>}
        </>
    );
}