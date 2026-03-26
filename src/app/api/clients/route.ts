import { type NextRequest, NextResponse } from 'next/server'
import { fetchAllClientsInfo } from '@/lib/dal/clients-dal'

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const page = Number(searchParams.get('page')) || 1
		const searchTerm = searchParams.get('search') || ''
		const searchTermCuttingWeek = Number(searchParams.get('week')) || 0
		const searchTermCuttingDay = searchParams.get('day') || ''
		const searchTermAssignedTo = searchParams.get('assigned') || ''

		const data = await fetchAllClientsInfo(
			page,
			searchTerm,
			searchTermCuttingWeek,
			searchTermCuttingDay,
			searchTermAssignedTo,
		)

		if (!data) {
			return NextResponse.json(
				{ error: 'Failed to fetch clients' },
				{ status: 500 },
			)
		}

		return NextResponse.json(data)
	} catch (error) {
		console.error('Error fetching clients:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}
