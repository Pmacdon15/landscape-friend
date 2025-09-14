import { inputClassName } from "@/lib/values";

export default function QuoteHeader() {
    return (
        <section>
            <h3 className="text-md font-semibold mb-2">Client Information</h3>
            <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Name</label>
                <input id="clientName" list="clients-list" className={inputClassName} />
                <datalist id="clients-list">

                </datalist>
            </div>
            <label htmlFor='clientEmail' className="block text-sm font-medium text-gray-700"> Email</label>
            <input id="clientEmail" type="text" className={inputClassName} />
            <label htmlFor='phone_number' className="block text-sm font-medium text-gray-700"> Phone Number</label>
            <input id="phone_number" type="text" className={inputClassName} />
            <label htmlFor='address' className="block text-sm font-medium text-gray-700"> Address</label>
            <input id="address" type="text" className={inputClassName} />
        </section>
    );
}