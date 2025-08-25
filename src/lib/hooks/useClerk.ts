import { getIsAdminAction } from '@/DAL/actions/clerk-actions';
import { useQuery } from '@tanstack/react-query';

export const useGetIsAdmin = () => {
    return useQuery({
        queryKey: ['isAdmin'],
        queryFn: async () => await getIsAdminAction(),
    });
};