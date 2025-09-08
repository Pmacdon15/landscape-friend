'use client'


import { Button } from "../button";
import EllipsisSpinner from "../loaders/EllipsisSpinner";
import { useCancelSubscription } from "@/lib/mutations/mutations";

export default function CancelSubscriptionButton({ subscriptionId }: { subscriptionId: string }) {
    const { mutate: cancelSubscription, isPending } = useCancelSubscription();
    return (

        <div className="mt-4">
            <Button variant="destructive" onClick={() => cancelSubscription(subscriptionId)} disabled={isPending}>
                {isPending ? <>Cancelling{" "}<EllipsisSpinner /></> : "Cancel Subscription"}
            </Button>
        </div>
    );
}