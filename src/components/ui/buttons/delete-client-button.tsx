'use client'
import { toast } from 'sonner'
import { Alert } from '@/components/ui/alerts/alert'
import { useDeleteClient } from '@/lib/mutations/mutations'
export default function DeleteClientButton({
	clientId,
	page,
}: {
	clientId: number
	page: number
}) {
	const { mutate } = useDeleteClient(page, {
		onSuccess: () => {
			toast.success('Client deleted!', { duration: 1500 })
		},
		onError: (error) => {
			console.error('Error deleting client', error)
			toast.error('Error deleting client!', { duration: 1500 })
		},
	})
	return (
		<div className="absolute top-1 right-1">
			<Alert
				functionAction={() => mutate(clientId)}
				variant={'remove-client'}
			/>
		</div>
	)
}
