import { fetchNovuIdAction } from '@/lib/actions/novu-action';
import { useQuery } from '@tanstack/react-query';

export const useGetNovuId = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['novuId', userId],
        queryFn: () => fetchNovuIdAction(userId!),
        enabled: !!userId,
    });
};