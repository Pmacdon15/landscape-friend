import type { Client, ClientResult } from '@/types/clients-types'

export function processClientsResult(
	clientsResult: ClientResult[],
	totalCount: number,
	pageSize: number,
): { clients: Client[]; totalPages: number } {
	const totalPages = Math.ceil(totalCount / pageSize)

	const clients = clientsResult.reduce((acc: Client[], current) => {
		const existingClient = acc.find(
			(client: Client) => client.id === current.id,
		)
		if (existingClient) {
			existingClient.cutting_schedules.push({
				cutting_week:
					current.cutting_week !== null ? current.cutting_week : 0,
				cutting_day:
					current.cutting_day !== null
						? current.cutting_day
						: 'No cut',
			})
		} else {
			acc.push({
				id: current.id,
				full_name: current.full_name,
				phone_number: current.phone_number,
				email_address: current.email_address,
				address: current.address,
				amount_owing: current.amount_owing,
				cutting_week: current.cutting_week,
				cutting_day: current.cutting_day,
				snow_assigned_to: current.snow_assigned_to,
				grass_assigned_to: current.grass_assigned_to,
				images: current.images,
				cutting_schedules: [
					{
						cutting_week:
							current.cutting_week !== null
								? current.cutting_week
								: 0,
						cutting_day:
							current.cutting_day !== null
								? current.cutting_day
								: 'No cut',
					},
				],
			})
		}
		return acc
	}, [])

	return { clients, totalPages }
}
