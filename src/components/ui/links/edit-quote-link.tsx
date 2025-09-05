import Link from "next/link";
import { Button } from "../button";

export default function EditQuoteLink({ quoteId }: { quoteId?: string }) {
    return (
        <Link prefetch={false} href={`/billing/edit/quote?quote=${quoteId}`}>
            <Button variant={'outline'}>Edit</Button>
        </Link>
    );
}