'use client'
import { Subscription } from "@/types/subscription-types";
import { DateDisplay } from "../../date-display";
import CancelSubscriptionButton from "../../buttons/cancel-subscription-button";
export function CardView({ subscriptions }: { subscriptions: Subscription[] }) {
    console.log('Subscriptions:', subscriptions);

    return (
        <div className="grid grid-cols-1 gap-4">
            {subscriptions.map((subscription) => {
                console.log('Subscription:', subscription);

                return (
                    <div key={subscription.id} className="bg-white shadow-md rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{subscription.customer.name || subscription.customer.email}</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {subscription.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">{subscription.customer.email}</p>
                        <CancelSubscriptionButton subscriptionId={subscription.id} />
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700">Subscription Details</p>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                <p><span className="font-semibold">Created:</span> <DateDisplay timestamp={subscription.created} /></p>
                                <p><span className="font-semibold">Status:</span> {subscription.status}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700">Items</p>
                            <ul className="mt-2 text-sm">
                                {subscription.items.data.map((item) => (
                                    <li key={item.id} className="flex justify-between">
                                        <span>{item.price.product} (x{item.quantity})</span>
                                        <span>${(item.price.unit_amount / 100).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {subscription.subscription_schedule ?
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700">Subscription Schedule</p>
                                {subscription.subscription_schedule.phases.map((phase, index) => (
                                    <p key={index}><DateDisplay timestamp={phase.start_date} /> - <DateDisplay timestamp={phase.end_date} /></p>
                                ))}
                            </div>
                            :
                            <p className="font-semibold">Keep this subscription as it will invoice for the client&apos;s first month</p>
                        }
                    </div>
                );
            })}
        </div>
    );
}
