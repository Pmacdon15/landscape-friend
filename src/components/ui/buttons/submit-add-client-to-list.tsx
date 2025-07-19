'use client'

import { useAddClient } from "@/mutations/mutations";
import { Button } from "../button";

export default function SubmitAddClientToList() {
    const { mutate, isPending, isError } = useAddClient();
    return (
        <>
            <Button
                // className={`ml-auto border p-2 rounded-sm ${!isPending ? "bg-background" : "bg-gray-400"} hover:bg-background/60 shadow-lg`}
                variant={"outline"}
                type="submit"
                formAction={mutate}
                disabled={isPending}
            >{!isPending ? "Submit" : "Pending"}</Button>
            {isError && <p className="text-red-500">Error Submitting</p>}
        </>
    );
}