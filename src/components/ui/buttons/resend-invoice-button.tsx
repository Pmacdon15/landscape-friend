'use client'
import { useResendIvoice } from "@/mutations/mutations";
import { Button } from "../button";

export default function ResendInvoiceButton({ invoiceId }: { invoiceId: string }) {
    const { mutate, isPending } = useResendIvoice();
    return (
        <Button
            variant="outline"
            disabled={isPending}
            onClick={() => mutate(invoiceId)}
        >Resend</Button>
    );
}