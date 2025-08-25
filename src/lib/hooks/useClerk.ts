import { getIsAdminAction } from '@/lib/DAL/actions/clerk-actions';
import { useQuery } from '@tanstack/react-query';

export const useGetIsAdmin = () => {
    return useQuery({
        queryKey: ['isAdmin'],
        queryFn: async () => await getIsAdminAction(),
    });
};