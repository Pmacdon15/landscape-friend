'use client'

import { useAddClient } from "@/mutations/mutations";

export default function SubmitAddClientToList() {
    const { mutate, isPending, isError } = useAddClient();
    return (
        <>
            <button
                className={`ml-auto border p-2 rounded-sm ${!isPending ? "bg-background" : "bg-gray-400"} hover:bg-background/60 shadow-lg`}
                type="submit"
                formAction={mutate}
                disabled={isPending}
            >{!isPending ? "Submit" : "Pending"}</button>
            {isError && <p className="text-red-500">Error Submitting</p>}
        </>
    );
}