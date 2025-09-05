import Link from "next/link";
import { Button } from "../button";

export default function EditInvoiceLink({ invoiceId }: { invoiceId?: string }) {
    return (
        <Link prefetch={false} href={`/billing/edit/invoice?invoice=${invoiceId}`}>
            <Button variant={'outline'}>Edit</Button>
        </Link>
    );
}