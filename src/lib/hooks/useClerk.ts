import { useQuery } from '@tanstack/react-query'
import { getIsAdminAction } from '@/actions/clerk-actions'

export const useGetIsAdmin = () => {
	return useQuery({
		queryKey: ['isAdmin'],
		queryFn: async () => await getIsAdminAction(),
	})
}
