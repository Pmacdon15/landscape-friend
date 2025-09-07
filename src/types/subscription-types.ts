export interface Subscription {
    id: string;
    object: string;
    status: string;
    start_date: number;
    cancel_at_period_end: boolean;
    canceled_at: number | null;
    created: number;
    trail_end: string;
    current_period_end: number;
    current_period_start: number;
    customer: {
        id: string;
        name: string | undefined;
        email: string | undefined;
        client_name?: string;
    };
    items: {
        data: SubscriptionItem[];
    };
}

export interface SubscriptionItem {
    id: string;
    object: string;
    quantity: number;
    price: {
        id: string;
        object: string;
        active: boolean;
        currency: string;
        product: string;
        unit_amount: number;
    };
}
