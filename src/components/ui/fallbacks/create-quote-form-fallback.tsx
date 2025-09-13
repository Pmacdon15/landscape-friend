import { Button } from "../button";

export function CreateQuoteFormFallback() {

    const inputClassName = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2";

    return (
        <>
            <form className="space-y-4">
                <input type="hidden" />

                {/* Client Info */}
                <section>
                    <h3 className="text-md font-semibold mb-2">Client Information</h3>
                    <div>
                        <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name</label>
                        <input id="clientName" list="clients-list" className={inputClassName} />
                        <datalist id="clients-list">

                        </datalist>
                    </div>
                    <input id="clientEmail" type="text" className={inputClassName} />
                    <input id="phone_number" type="text" className={inputClassName} />
                    <input id="address" type="text" className={inputClassName} />
                </section>

                {/* Labour Details */}
                <section>
                    <h3 className="text-md font-semibold mb-2">Cost Details</h3>
                    <input id="labourCostPerUnit" type="number" className={inputClassName} min="0" step="0.01" />
                    <input id="labourUnits" type="number" className={inputClassName} min="1" step="1" />
                </section>

                {/* Dynamic Materials Section */}
                <section>
                    <h3 className="text-md font-semibold mb-2"> Items</h3>
                    <div className="border p-4 mb-4 rounded-md">
                        <input
                            id={`description`}
                            type="text"
                            className={inputClassName}
                        />
                        <input
                            id={`materialType`}
                            type="text"
                            className={inputClassName}
                        />
                        <input
                            id={'materialCostPerUnit'}
                            type="number"
                            className={inputClassName}
                            min="0"
                            step="0.01"                            
                        />
                        <input                           
                            id={'materialUnits'}
                            type="number"
                           className={inputClassName}
                            min="1"
                            step="1"
                        />  
                    </div>                   

                    <Button
                        type="button"                        
                        className="mt-2"
                    >
                        Add Item
                    </Button>
                </section>

                <p className="font-bold mt-2">Total: $</p>
                <div>
                    <Button variant="outline" type="submit" >
                        Create Quote
                    </Button>
                </div>                
            </form >
        </>
    );
}
