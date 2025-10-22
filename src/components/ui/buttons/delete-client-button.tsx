'use client'
import { Alert } from '@/components/ui/alerts/alert'
import { useDeleteClient } from '@/lib/mutations/mutations'
export default function DeleteClientButton({ clientId }: { clientId: number }) {
	const { mutate } = useDeleteClient()
	return (
		<div className="absolute top-1 right-1">
			<Alert
				variant={'remove-client'}
				functionAction={() => mutate(clientId)}
			/>
		</div>
	)
}
