import { auth } from '@clerk/nextjs/server'
import type { OrgMember } from '@/types/clerk-types'
import { getOrgMembers } from '../utils/clerk'

export async function fetchOrgMembers(): Promise<
	OrgMember[] | { errorMessage: string }
> {
	const { orgId, userId, sessionClaims } = await auth.protect()

	if (!orgId) {
		return [
			{
				userId: userId,
				userName: sessionClaims.userFullName as string | null,
			},
		]
	}

	try {
		const orgMembers = getOrgMembers(orgId)

		return orgMembers
	} catch (error) {
		console.error('Error fetching org members:', error)
		return { errorMessage: 'Error fetching org members' }
	}
}
