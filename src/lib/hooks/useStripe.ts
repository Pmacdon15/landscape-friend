import { hasStripeApiKeyAction } from '@/DAL/actions/stripe-actions';
import { useQuery } from '@tanstack/react-query';

export const useHasStripeApiKey = () => {
    return useQuery({
        queryKey: ['hasStripeApiKey'],
        queryFn: () => hasStripeApiKeyAction(),
    });
};