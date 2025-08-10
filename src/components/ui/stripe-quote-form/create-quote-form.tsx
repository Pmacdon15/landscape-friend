'use client';

import React, { useState } from 'react';
import { useCreateStripeQuote } from '@/mutations/mutations';
import FormContainer from '../containers/form-container';
import ContentContainer from '../containers/content-container';
import { Button } from '@/components/ui/button'

export function CreateQuoteForm() {
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [labourCostPerUnit, setLabourCostPerUnit] = useState(0); // Renamed
    const [labourUnits, setLabourUnits] = useState(1); // New state
    const [materialType, setMaterialType] = useState(''); // New state
    const [materialCostPerUnit, setMaterialCostPerUnit] = useState(0); // Renamed
    const [materialUnits, setMaterialUnits] = useState(1); // New state
    const [taxRate, setTaxRate] = useState(0);
    const { mutate, isPending, isSuccess, isError, data, error } = useCreateStripeQuote();

    const inputClassName = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2";

    const subtotal = (labourCostPerUnit * labourUnits) + (materialCostPerUnit * materialUnits);
    const calculatedTax = subtotal * (taxRate / 100);
    const grandTotal = subtotal + calculatedTax;

    return (
        <FormContainer>
            <ContentContainer>
                <div className="p-4 border rounded-md shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Create Stripe Quote</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault(); // Prevent default form submission
                        mutate({
                            clientName,
                            clientEmail,
                            labourCostPerUnit,
                            labourUnits,
                            materialType,
                            materialCostPerUnit,
                            materialUnits
                        });
                    }} className="space-y-4">
                        <section>
                            <h3 className="text-md font-semibold mb-2">Client Information</h3>
                            <div>
                                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name:</label>
                                <input
                                    type="text"
                                    id="clientName"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    className={inputClassName}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">Client Email:</label>
                                <input
                                    type="email"
                                    id="clientEmail"
                                    value={clientEmail}
                                    onChange={(e) => setClientEmail(e.target.value)}
                                    className={inputClassName}
                                    required
                                />
                            </div>
                        </section>

                        <section>
                            <h3 className="text-md font-semibold mb-2">Cost Details</h3>
                            <div>
                                <label htmlFor="labourCostPerUnit" className="block text-sm font-medium text-gray-700">Labour Cost (per unit):</label>
                                <input
                                    type="number"
                                    id="labourCostPerUnit"
                                    value={labourCostPerUnit}
                                    onChange={(e) => setLabourCostPerUnit(parseFloat(e.target.value))}
                                    className={inputClassName}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="labourUnits" className="block text-sm font-medium text-gray-700">Labour Units:</label>
                                <input
                                    type="number"
                                    id="labourUnits"
                                    value={String(labourUnits)}
                                    onChange={(e) => setLabourUnits(parseInt(e.target.value))}
                                    className={inputClassName}
                                    min="1"
                                    step="1"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="materialType" className="block text-sm font-medium text-gray-700">Material Type:</label>
                                <input
                                    type="text"
                                    id="materialType"
                                    value={materialType}
                                    onChange={(e) => setMaterialType(e.target.value)}
                                    className={inputClassName}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="materialCostPerUnit" className="block text-sm font-medium text-gray-700">Material Cost (per unit):</label>
                                <input
                                    type="number"
                                    id="materialCostPerUnit"
                                    value={String(materialCostPerUnit)}
                                    onChange={(e) => setMaterialCostPerUnit(parseFloat(e.target.value))}
                                    className={inputClassName}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="materialUnits" className="block text-sm font-medium text-gray-700">Material Units:</label>
                                <input
                                    type="number"
                                    id="materialUnits"
                                    value={String(materialUnits)}
                                    onChange={(e) => setMaterialUnits(parseInt(e.target.value))}
                                    className={inputClassName}
                                    min="1"
                                    step="1"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">Tax Rate (%):</label>
                                <input
                                    type="number"
                                    id="taxRate"
                                    value={taxRate}
                                    onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                                    className={inputClassName}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </section>

                        <section>
                            <h3 className="text-md font-semibold mb-2">Estimated Totals</h3>
                            <p>Labour Cost: ${(labourCostPerUnit * labourUnits).toFixed(2)}</p>
                            <p>Material Cost: ${(materialCostPerUnit * materialUnits).toFixed(2)}</p>
                            <p>Subtotal: ${subtotal.toFixed(2)}</p>
                            <p>Tax ({taxRate}%): ${calculatedTax.toFixed(2)}</p>
                            <p className="font-bold">Grand Total: ${grandTotal.toFixed(2)}</p>
                        </section>

                        <Button variant="outline"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? 'Creating Quote...' : 'Create Quote'}
                        </Button>
                    </form>

                    {isSuccess && data && (
                        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
                            <p>Quote created successfully!</p>
                            <p>Quote ID: {data.quoteId}</p>
                        </div>
                    )}

                    {isError && error && (
                        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
                            <p>Error creating quote:</p>
                            <p>{error.message}</p>
                        </div>
                    )}
                </div>
            </ContentContainer>
        </FormContainer>
    );
}