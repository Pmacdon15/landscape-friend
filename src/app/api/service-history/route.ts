import { type NextRequest, NextResponse } from 'next/server'
import { fetchServiceHistory } from '@/lib/dal/service-history-dal'
import type { ParsedServiceHistoryParams } from '@/types/service-history-types'

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const page = Number(searchParams.get('page')) || 1
		const search = searchParams.get('search') || ''
		const serviceType = searchParams.get('serviceType') || ''
		const assignedTo = searchParams.get('assignedTo') || ''
		const date = searchParams.get('date') || ''

		const params: ParsedServiceHistoryParams = {
			page,
			search,
			serviceType,
			assignedTo,
			date,
		}

		const data = await fetchServiceHistory(params)

		if (!data) {
			return NextResponse.json(
				{ error: 'Failed to fetch service history' },
				{ status: 500 },
			)
		}

		return NextResponse.json(data)
	} catch (error) {
		console.error('Error fetching service history:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}
