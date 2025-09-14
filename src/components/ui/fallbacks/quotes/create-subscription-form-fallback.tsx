import { Button } from "../../button";
import QuoteHeader from "./header";

export default function CreateSubscriptionFormFallback() {
    const inputClassName = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2";
    return (
        <form className="space-y-4">
            <input type="hidden" />

            {/* Client Info */}
            <QuoteHeader />

            {/* Subscription Details */}
            <section>
                <h3 className="text-md font-semibold mb-2">Subscription Details</h3>
                <div>
                    <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">Service Type</label>
                    <select
                        id="serviceType"
                        className={inputClassName}
                    >
                        <option value="weekly">Weekly</option>
                        <option value="bi-weekly">Bi-Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="as-needed">Snow as needed</option>
                    </select>
                </div>
                <input id="price_per_month" type="number" className={inputClassName} min="0.01" step="0.01" />
                <input id="startDate" type="date" className={inputClassName} />
                <input id="endDate" type="date" className={inputClassName} />
                <input id="notes" type="textarea" className={inputClassName} />
            </section>

            <div>
                <Button variant="outline" type="submit" >
                    Create Subscription
                </Button>
            </div>
        </form>
    );
};