import { useQuery } from '@tanstack/react-query'
import { fetchNovuIdAction } from '@/lib/actions/novu-action'

export const useGetNovuId = (userId: string | undefined) => {
	return useQuery({
		queryKey: ['novuId', userId],
		queryFn: () => fetchNovuIdAction(userId as string),
		enabled: !!userId,
	})
}
