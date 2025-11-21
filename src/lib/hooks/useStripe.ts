import { useQuery } from '@tanstack/react-query'
import {
	getProductPrice,
	hasStripeApiKeyAction,
} from '@/lib/actions/stripe-action'

export const useHasStripeApiKey = () => {
	return useQuery({
		queryKey: ['hasStripeApiKey'],
		queryFn: () => hasStripeApiKeyAction(),
	})
}

export const useIsSnowService = (serviceType: string) => {
	return serviceType === 'snow-as-needed'
}




interface ProductPrice {
  unit_amount: number | null;
  // Add other properties as needed
}

export const useProductPrices = (productIds: (string | undefined)[]) => {
  const filteredProductIds = productIds.filter((id): id is string => id !== null);

  return useQuery({
    queryKey: ['productPrices', filteredProductIds],
    queryFn: async () => {
      const prices = await Promise.all(
        filteredProductIds.map(async (productId) => {
          try {
            return await getProductPrice(productId);
          } catch (e) {
            console.error(`Error fetching price for ${productId}:`, e);
            return null;
          }
        }),
      );
      return filteredProductIds.reduce((acc, productId, index) => {
        acc[productId] = prices[index];
        return acc;
      }, {} as Record<string, ProductPrice | null>);
    },
    enabled: filteredProductIds.length > 0,
  });
};