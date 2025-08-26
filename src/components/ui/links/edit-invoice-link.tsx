import Link from "next/link";
import { Button } from "../button";

export default function EditInvoiceLink() {
    return (
        <Link href="/billing/edit/invoice">
            <Button variant={'outline'}>Edit Invoice</Button>
        </Link>
    );
}