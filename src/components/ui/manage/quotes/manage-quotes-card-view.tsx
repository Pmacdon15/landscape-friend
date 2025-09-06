import { StripeQuote } from "@/types/stripe-types";
import ManageQuoteButton from "../../buttons/manage-quote-button";

export function ManageQuoteCardView({ quotes }: { quotes: StripeQuote[] }) {
    const cardClassName = "p-4 border rounded-lg shadow-md mb-4 bg-white w-full md:w-[48%] lg:w-[30%] xl:w-[30%] mx-auto";
    return (
        <div className="flex flex-wrap justify-between ">
            {quotes && quotes !== undefined && quotes.map((quote) => (
                <div key={quote.id} className={cardClassName}>
                    <div className="font-bold text-lg mb-2 break-words">Quote #{quote.id}</div>
                    <div className="flex justify-between mb-1">
                        <span className="font-bold">Customer:</span>
                        <span>{quote.client_name}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span className="font-bold">Amount Total:</span>
                        <span>${quote.amount_total !== null ? (quote.amount_total / 100).toFixed(2) : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span className="font-bold">Status:</span>
                        <span>{quote.status}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="font-bold">Expires At:</span>
                        <span>{quote.expires_at !== null ? new Date(quote.expires_at * 1000).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="mb-2">
                        <span className="font-bold">Line Items:</span>
                        <ul className="list-disc list-inside">
                            {quote.lines?.data && quote.lines.data.length > 0 ? (
                                quote.lines.data.map((item, index) => (
                                    <li key={index}>
                                        {item.description} - ${(item.amount ).toFixed(2)}
                                    </li>
                                ))
                            ) : (
                                <li>No line items</li>
                            )}
                        </ul>
                    </div>
                    <div className="flex flex-wrap justify-center w-full gap-4 ">
                        {quote.status == "draft" && <ManageQuoteButton action="edit" quoteId={quote.id} />}
                        {quote.status == "draft" && <ManageQuoteButton action="send" quoteId={quote.id} />}
                        {quote.status == "open" && <ManageQuoteButton action="accept" quoteId={quote.id} />}
                        {quote.status == "open" && <ManageQuoteButton action="cancel" quoteId={quote.id} />}
                    </div>
                </div>
            ))}
        </div>
    );
}