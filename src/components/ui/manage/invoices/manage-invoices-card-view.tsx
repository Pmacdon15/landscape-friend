import { StripeInvoice } from "@/types/stripe-types";
import ManageInvoiceButton from "../../buttons/manage-invoice-button";
import Link from "next/link";
import EditInvoiceLink from "../../links/edit-invoice-link";

export function CardView({ invoices }: { invoices: StripeInvoice[] }) {
  const cardClassName = "p-4 border rounded-lg shadow-md mb-4 bg-white w-full md:w-[48%] lg:w-[30%] xl:w-[30%] mx-auto";

  return (
    <div className="flex flex-wrap justify-between ">
      {invoices.map((invoice) => (
        <div key={invoice.id} className={cardClassName}>
          {<div className="font-bold text-lg mb-2 break-words">Invoice #{invoice.id}</div>}
          <div className="flex justify-between mb-1">
            <span className="font-bold">Customer:</span>
            <span>{invoice.customer_name}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="font-bold">Amount Due:</span>
            <span>${invoice.amount_due.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="font-bold">Status:</span>
            <span>{invoice.status}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-bold">Due Date:</span>
            <span>{new Date(invoice.due_date * 1000).toLocaleDateString()}</span>
          </div>
          <div className="mb-2">
            <span className="font-bold">Line Items:</span>
            <ul className="list-disc list-inside">
              {invoice.lines?.data && invoice.lines.data.length > 0 ? (
                invoice.lines.data.map((item, index) => (
                  <li key={index}>
                    {item.description} - ${(item.amount / 100).toFixed(2)}
                  </li>
                ))
              ) : (
                <li>No line items</li>
              )}
            </ul>
          </div>
          <div className="flex flex-wrap justify-between ">
            {invoice.hosted_invoice_url &&
              <Link
                href={invoice.hosted_invoice_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline w-full mb-2"
              >
                View Invoice
              </Link>
            }
            <div className="flex flex-wrap justify-center w-full gap-4 ">
              {invoice.status === "draft" ?
                <>
                  <ManageInvoiceButton variant="send" invoiceId={invoice.id} />
                  <EditInvoiceLink invoiceId={invoice.id} />
                </>
                :
                invoice.status !== "void" && invoice.status !== "paid" && <ManageInvoiceButton variant="resend" invoiceId={invoice.id} />
              }
              {invoice.status !== "paid" && invoice.status !== "draft" && invoice.status !== "void" &&
                <>
                  <ManageInvoiceButton variant="paid" invoiceId={invoice.id} />
                  <ManageInvoiceButton variant="void" invoiceId={invoice.id} />
                </>
              }
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}