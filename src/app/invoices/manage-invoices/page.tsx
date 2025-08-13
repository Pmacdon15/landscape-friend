import { fetchOpenInvoices } from "@/actions/stripe";
import FormContainer from "@/components/ui/containers/form-container";
import { StripeInvoice } from "@/types/types";

export default async function Page() {
    const invoices: StripeInvoice[] = await fetchOpenInvoices()
    console.log("Invoices: ", invoices)
    return (
        <FormContainer>
            <h1 className="text-2xl font-bold mb-4">Manage Invoices</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Invoice Number</th>
                        <th className="py-2 px-4 border-b">Customer Name</th>
                        <th className="py-2 px-4 border-b">Amount Due</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Due Date</th>
                        <th className="py-2 px-4 border-b">Link</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                            <td className="py-2 px-4 border-b">{invoice.number}</td>
                            <td className="py-2 px-4 border-b">{invoice.customer_name}</td>
                            <td className="py-2 px-4 border-b">{invoice.amount_due / 100}</td>
                            <td className="py-2 px-4 border-b">{invoice.status}</td>
                            <td className="py-2 px-4 border-b">{new Date(invoice.due_date * 1000).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b">
                                <a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
                                    View Invoice
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </FormContainer>
    );
}