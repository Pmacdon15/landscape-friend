import { auth, clerkClient } from '@clerk/nextjs/server'
import type { OrgMember } from '@/types/clerk-types'

type AuthProtectResult = Awaited<ReturnType<typeof auth.protect>>
type AuthResult = Awaited<ReturnType<typeof auth>>
type CombinedAuthResult = AuthProtectResult | AuthResult

export async function isOrgAdmin(protect = true) {
	let authResult: CombinedAuthResult
	if (protect) {
		authResult = await auth.protect()
	} else {
		authResult = await auth()
	}

	const { userId, orgId, sessionClaims } = authResult
	let isAdmin = false
	if (orgId && sessionClaims.orgRole === 'org:admin') isAdmin = true

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

export async function deleteEmptyOrganizations() {
	try {
		const clerk = await clerkClient()

		// Get all organizations
		const organizations = await clerk.organizations.getOrganizationList()

		// Loop through each organization
		for (const organization of organizations.data) {
			const organizationId = organization.id

			// Get the organization's memberships
			const orgMemberships =
				await clerk.organizations.getOrganizationMembershipList({
					organizationId,
				})

			// Check if the organization has no members
			if (orgMemberships.data.length === 0) {
				// Delete the organization
				await clerk.organizations.deleteOrganization(organizationId)
				console.log(`Organization ${organizationId} deleted.`)
			}
		}
	} catch (error) {
		console.error(`Error deleting organization: ${error}`)
	}
}
