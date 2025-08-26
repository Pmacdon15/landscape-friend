import Link from "next/link";
import { Button } from "../button";

export default function EditInvoiceLink() {
    return (
        <Link href="/billing/manage/invoices/edit">
            <Button variant={'outline'}>Edit Invoice</Button>
        </Link>
    );
}