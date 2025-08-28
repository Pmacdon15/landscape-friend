import React from 'react';
import { Button } from '../button';

export function EditInvoiceFormFallback() {
    const inputClassName = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2";
    return (
        <form className="space-y-4">
            <section>
                <h3 className="text-md font-semibold mb-2">Invoice Lines</h3>
                <div className="border p-4 mb-4 rounded-md">
                    <div>
                        <label htmlFor={`lines.description`} className="block text-sm font-medium text-gray-700">Description:</label>
                        <input
                            type="text"
                            id={`lines.description`}
                            className={inputClassName}
                        />
                    </div>
                    <div>
                        <label htmlFor={`lines.amount`} className="block text-sm font-medium text-gray-700">Amount (per unit):</label>
                        <input
                            type="number"
                            id={`lines.amount`}
                            className={inputClassName}
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label htmlFor={`lines.quantity`} className="block text-sm font-medium text-gray-700">Quantity:</label>
                        <input
                            type="number"
                            id={`lines.quantity`}
                            className={inputClassName}
                            min="1"
                            step="1"
                        />
                    </div>
                    <Button className="mt-2">
                        Remove Line
                    </Button>
                </div>
            </section>
            <section>
                <h3 className="text-md font-semibold mb-2">Totals</h3>
                <p className="font-bold">Grand Total: ${0o0.toFixed(2)}</p>
            </section>
            <Button
                variant="outline"
                type="submit"
            >
                Update Invoice
            </Button>
        </form >
    );
}