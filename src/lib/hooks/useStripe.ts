import { hasStripeApiKeyAction } from '@/lib/actions/stripe-action';
import { useQuery } from '@tanstack/react-query';

export const useHasStripeApiKey = () => {
    return useQuery({
        queryKey: ['hasStripeApiKey'],
        queryFn: () => hasStripeApiKeyAction(),
    });
};