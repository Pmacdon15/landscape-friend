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
            <MobileCardView invoices={invoices} />
        </FormContainer>
    );
}

function TableHead() {
    const tableClassName = "py-2 px-4 border-b"
    return (
        <thead className="hidden md:table-header-group">
            <tr>
                <th className={tableClassName}>Invoice Number</th>
                <th className={tableClassName}>Customer Name</th>
                <th className={tableClassName}>Amount Due</th>
                <th className={tableClassName}>Status</th>
                <th className={tableClassName}>Due Date</th>
                <th className={tableClassName}>Link</th>
                <th className={tableClassName}>Send</th>
                <th className={tableClassName}>Paid</th>
            </tr>
        </thead>
    )
}

function TableBody({ invoices }: { invoices: StripeInvoice[] }) {
    const tableClassName = "py-2 px-4 border-b ";
    // const cardClassName = "p-4 border rounded-lg shadow-md mb-4 bg-white ";

    return (
        <tbody className="hidden md:table-row-group">
            {invoices.map((invoice) => (
                <tr key={invoice.id}>
                    <td className={tableClassName}>{invoice.number}</td>
                    <td className={tableClassName}>{invoice.customer_name}</td>
                    <td className={tableClassName}>{(invoice.amount_due / 100).toFixed(2)}</td>
                    <td className={tableClassName}>{invoice.status}</td>
                    <td className={tableClassName}>{new Date(invoice.due_date * 1000).toLocaleDateString()}</td>
                    <td className={tableClassName}>
                        {invoice.hosted_invoice_url &&
                            <Link href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                View Invoice
                            </Link>
                        }
                    </td>
                    <td className={`${tableClassName} text-center`}>
                        {invoice.status === 'draft' ?
                            <ManageInvoiceButton key={`${invoice.id}-send-desktop`} variant="send" invoiceId={invoice.id} />
                            :
                            <ManageInvoiceButton key={`${invoice.id}-resend-desktop`} variant="resend" invoiceId={invoice.id} />
                        }
                    </td>
                    <td className={`${tableClassName} text-center`}>
                        {invoice.status !== 'paid' && invoice.status !== 'void' && <ManageInvoiceButton key={`${invoice.id}-paid-desktop`} variant="paid" invoiceId={invoice.id} />}
                    </td>

                </tr>
            ))
            }
        </tbody >
    );
}

function MobileCardView({ invoices }: { invoices: StripeInvoice[] }) {
    const cardClassName = "p-4 border rounded-lg shadow-md mb-4 bg-white";
    return (
        <div className="md:hidden">
            {invoices.map((invoice) => (
                <div key={invoice.id} className={cardClassName}>
                    <div className="font-bold text-lg mb-2">Invoice #{invoice.number}</div>
                    <div className="mb-1"><strong>Customer:</strong> {invoice.customer_name}</div>
                    <div className="mb-1"><strong>Amount Due:</strong> ${(invoice.amount_due / 100).toFixed(2)}</div>
                    <div className="mb-1"><strong>Status:</strong> {invoice.status}</div>
                    <div className="mb-2"><strong>Due Date:</strong> {new Date(invoice.due_date * 1000).toLocaleDateString()}</div>
                    <div className="flex flex-col space-y-2">
                        {invoice.hosted_invoice_url &&
                            <Link href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                View Invoice
                            </Link>
                        }
                        {invoice.status === 'draft' ?
                            <ManageInvoiceButton key={`${invoice.id}-send-desktop`} variant="send" invoiceId={invoice.id} />
                            :
                            <ManageInvoiceButton key={`${invoice.id}-resend-desktop`} variant="resend" invoiceId={invoice.id} />
                        }
                        {invoice.status !== 'paid' && invoice.status !== 'void' && <ManageInvoiceButton key={`${invoice.id}-paid-desktop`} variant="paid" invoiceId={invoice.id} />}
                    </div>
                </div>
            ))
            }
        </div >
    );
}