'use client'
import { useSendEmailWithTemplate } from "@/mutations/mutations";
import { Button } from "../button";

export default function SendClientEmailButton({ clientEmail }: { clientEmail: string[] }) {
    const { mutate, isPending } = useSendEmailWithTemplate(clientEmail)

    if (!clientEmail.length) {
        return <div>No clients to send email to</div>
    }

    return (
        <Button formAction={(formData) => mutate(formData)} disabled={isPending} variant={"outline"}>Send</Button>
    );
}