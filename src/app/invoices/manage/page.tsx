import { fetchOpenInvoices } from "@/DAL/dal";
import ResendInvoiceButton from "@/components/ui/buttons/resend-invoice-button";
import FormContainer from "@/components/ui/containers/form-container";
import { StripeInvoice } from "@/types/types";

export default async function Page() {
    const invoices: StripeInvoice[] = await fetchOpenInvoices()
    console.log("Invoices: ", invoices)
    const tableClassName = "py-2 px-4 border-b"
    return (
        <FormContainer>
            <h1 className="text-2xl font-bold mb-4">Manage Invoices</h1>
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
                        <a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
                            View Invoice
                        </a>
                    </td>
                    <td className={tableClassName}> <ResendInvoiceButton invoiceId={invoice.id} /></td>
                </tr>
            ))}
        </tbody>
    )
}