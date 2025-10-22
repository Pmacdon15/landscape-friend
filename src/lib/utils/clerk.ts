// import { auth, clerkClient } from '@clerk/nextjs/server'
import type { OrgMember } from '@/types/clerk-types'

export async function isOrgAdmin(protect = true) {
	let authResult:{userId:string, orgId:string, sessionClaims:}
	if (protect) {
		authResult = await auth.protect()
	} else {
		authResult = await auth()
	}

	const { userId, orgId, sessionClaims } = authResult
	let isAdmin = true
	if (orgId && sessionClaims.orgRole !== 'org:admin') isAdmin = false

	return { userId, orgId, sessionClaims, isAdmin }
}

export async function getOrgMembers(orgId: string): Promise<OrgMember[]> {
	if (!orgId) return []
	const clerk = await clerkClient()
	try {
		const memberships =
			await clerk.organizations.getOrganizationMembershipList({
				organizationId: orgId,
			})

		const members: OrgMember[] = memberships.data.map((membership) => ({
			userId: membership.publicUserData?.userId || '',
			userName:
				membership.publicUserData?.firstName +
					' ' +
					membership.publicUserData?.lastName || 'Personal Workspace',
			role: membership.role,
		}))

		return members
	} catch (error) {
		console.error('Error fetching organization members:', error)
		return []
	}
}
