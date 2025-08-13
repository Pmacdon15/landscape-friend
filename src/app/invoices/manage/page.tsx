import { fetchOpenInvoices } from "@/DAL/dal";
import ManageInvoiceButton from "@/components/ui/buttons/manage-invoice-button";
import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";
import { StripeInvoice } from "@/types/types";
import Link from "next/link";

export default async function Page() {
    const invoices: StripeInvoice[] = await fetchOpenInvoices()

    return (
        <FormContainer>
            <FormHeader text={"Manage Invoices"} />
            <table className="min-w-full bg-white">
                <TableHead />
                <TableBody invoices={invoices} />
            </table>
        </FormContainer>
    );
}

function TableHead() {
    const tableClassName = "py-2 px-4 border-b"
    return (
        <thead>
            <tr>
                <th className={tableClassName}>Invoice Number</th>
                <th className={tableClassName}>Customer Name</th>
                <th className={tableClassName}>Amount Due</th>
                <th className={tableClassName}>Status</th>
                <th className={tableClassName}>Due Date</th>
                <th className={tableClassName}>Link</th>
                <th className={tableClassName}>Resend</th>
                <th className={tableClassName}>Paid</th>
            </tr>
        </thead>
    )
}

function TableBody({ invoices }: { invoices: StripeInvoice[] }) {
    const tableClassName = "py-2 px-4 border-b"
    return (
        <tbody>
            {invoices.map((invoice) => (
                <tr key={invoice.id}>
                    <td className={tableClassName}>{invoice.number}</td>
                    <td className={tableClassName}>{invoice.customer_name}</td>
                    <td className={tableClassName}>{invoice.amount_due / 100}</td>
                    <td className={tableClassName}>{invoice.status}</td>
                    <td className={tableClassName}>{new Date(invoice.due_date * 1000).toLocaleDateString()}</td>
                    <td className={tableClassName}>
                        <Link href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                            View Invoice
                        </Link>
                    </td>
                    <td className={tableClassName}> <ManageInvoiceButton key={`${invoice.id}-resend`} variant="resend" invoiceId={invoice.id} /></td>
                    <td className={tableClassName}> <ManageInvoiceButton key={`${invoice.id}-paid`} variant="paid" invoiceId={invoice.id} /></td>
                </tr>
            ))}
        </tbody>
    )
}