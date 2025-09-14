import { hasStripeApiKeyAction, getProductPrice } from '@/lib/actions/stripe-action';
import { useQuery } from '@tanstack/react-query';

export const useHasStripeApiKey = () => {
    return useQuery({
        queryKey: ['hasStripeApiKey'],
        queryFn: () => hasStripeApiKeyAction(),
    });
};

export const useIsSnowService = (serviceType: string) => {
  return serviceType === 'snow-as-needed';
};

export const useProductPrice = (productId: string | null) => {
    return useQuery({
        queryKey: ['productPrice', productId],
        queryFn: () => {
            if (!productId) return null;
            return getProductPrice(productId);
        },
        enabled: !!productId, // Only run the query if productId is not null
    });
};

