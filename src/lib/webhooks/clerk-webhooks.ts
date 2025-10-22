import { neon } from '@neondatabase/serverless'
import {
	addNovuSubscriber,
	deleteNovuSubscriber,
	triggerNotificationSendToAdmin,
} from '../utils/novu'
import { v4 as uuidv4 } from 'uuid'
import { clerkClient } from '@clerk/nextjs/server'
import { handleOrganizationDeletedDb } from '../DB/org-db'
import { deleteStripeWebhookRoute } from '../utils/stripe-utils'
import { deleteClientsBlobs } from '../utils/blobs'

export async function handleUserCreated(
	userId: string,
	userName: string,
	userEmail: string,
) {
	console.log('userId in handleUserCreated:', userId)
	const sql = neon(`${process.env.DATABASE_URL}`)

	const subscriberId = uuidv4()
	// Insert user, and do nothing if the user already exists.
	const insertResult = await sql`
        INSERT INTO users (id, name, email, novu_subscriber_id)
        VALUES (${userId}, ${userName}, ${userEmail}, ${subscriberId})
        ON CONFLICT (id) DO NOTHING
        RETURNING *;
    `

	// Only if a new user was created, add them to Novu.
	if (insertResult.length > 0) {
		console.log(
			'Calling addNovuSubscriber with subscriberId:',
			subscriberId,
		)
		const result = await addNovuSubscriber(
			subscriberId,
			userEmail,
			userName,
		)
		if (!result) {
			console.error(`Failed to add user ${userId} to Novu.`)
		}
	}
}
export async function handleUserDeleted(userId: string) {
	const sql = neon(`${process.env.DATABASE_URL}`)

	// Delete the user from the database
	const deleteResult = await sql`
        DELETE FROM users
        WHERE id = ${userId}
        RETURNING *;
    `

	if (deleteResult.length > 0) {
		console.log(`User ${userId} deleted from database.`)

		// Remove the user from Novu
		const user = deleteResult[0]
		if (user.novu_subscriber_id) {
			const result = await deleteNovuSubscriber(user.novu_subscriber_id)
			if (!result) {
				console.error(`Failed to remove user ${userId} from Novu.`)
			}
		}
	} else {
		console.log(`User ${userId} not found in database.`)
	}
}

export async function handleOrganizationCreated(
	orgId: string,
	orgName: string,
) {
	const sql = neon(`${process.env.DATABASE_URL}`)
	await sql`
        INSERT INTO organizations (organization_id, organization_name)
        VALUES (${orgId}, ${orgName});               
    `
}

export async function handleOrganizationDeleted(orgId: string) {
	await deleteStripeWebhookRoute(orgId)
	await deleteClientsBlobs(orgId)
	await handleOrganizationDeletedDb(orgId)
}

export async function handleSubscriptionUpdate(orgId: string, plan: string) {
	// Placeholder for subscription update logic
	console.log(
		`Subscription update for organization ${orgId} with plan ${plan}`,
	)
	// You would typically update your database here based on the subscription plan
	const clerk = await clerkClient()

	if (plan === 'new_business_plan') {
		await clerk.organizations.updateOrganization(orgId, {
			maxAllowedMemberships: 4,
		})
		await triggerNotificationSendToAdmin(orgId, 'subscription-added')
	}
	// else if (plan === 'pro_25_people_org') {
	//     await clerk.organizations.updateOrganization(orgId, {
	//         maxAllowedMemberships: 25
	//     })
	else {
		await clerk.organizations.updateOrganization(orgId, {
			maxAllowedMemberships: 1,
		})
	}
}
