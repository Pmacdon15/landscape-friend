'use client'
import { StripeQuote } from "@/types/stripe-types";
import { DateDisplay } from "../../date-display";
import ManageQuoteButton from "../../buttons/manage-quote-button";

export function ManageQuoteCardView({ quotes }: { quotes: StripeQuote[] }) {
    return (
        <div className="grid grid-cols-1 gap-4">
            {quotes.map((quote) => (
                <div key={quote.id} className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{quote.client_name || quote.customer_name}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${quote.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {quote.status}
                        </span>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700">Quote Details</p>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                            <p><span className="font-semibold">Amount Total:</span> ${quote.amount_total !== null ? (quote.amount_total / 100).toFixed(2) : 'N/A'}</p>
                            <p><span className="font-semibold">Expires At:</span> {quote.expires_at !== null ? <DateDisplay timestamp={quote.expires_at} /> : 'N/A'}</p>
                            <p><span className="font-semibold">Created At:</span> {quote.created !== null ? <DateDisplay timestamp={quote.created} /> : 'N/A'}</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700">Items</p>
                        <ul className="mt-2 text-sm">
                            {quote.lines?.data.map((item) => (
                                <li key={item.id} className="flex justify-between">
                                    <span>{item.description} (x{item.quantity})</span>
                                    <span>${(item.amount * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-wrap justify-center w-full gap-4 mt-4">
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
