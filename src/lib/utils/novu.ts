import { Novu } from '@novu/api'
import type { PayloadType } from '@/types/webhooks-types'
import { getNovuIds } from '../DB/clients-db'
import { getOrgMembers } from './clerk'

export async function addNovuSubscriber(
	subscriberId: string,
	email?: string,
	userName?: string,
) {
	console.log('addNovuSubscriber called with:', {
		subscriberId,
		email,
		userName,
	})
	const firstName = userName?.split(' ')[0] || email?.split('@')[0] || 'New'
	const lastName = userName?.split(' ')[1] || ''

	try {
		await novu.subscribers.create({
			subscriberId,
			email,
			firstName,
			lastName,
		})
	} catch (error) {
		console.error('Error creating novu subscriber:', error)
		// It might be that the subscriber already exists, which is fine.
	}

	await sendWelcomeNotification(subscriberId)
	return true
}

export async function deleteNovuSubscriber(subscriberId: string) {
	const result = await novu.subscribers.delete(subscriberId)
	console.log('Result from delete novu sub: ', result)
	console.log(`Subscriber ${subscriberId} deleted successfully`)
	return true
}

export async function removeNovuSubscriber(subscriberId: string) {
	try {
		const response = await fetch(
			`${process.env.NOVU_API_URL}/subscribers/${subscriberId}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `ApiKey ${process.env.NOVU_API_KEY}`,
				},
			},
		)

		if (response.ok) {
			// console.log(`Subscriber ${subscriberId} removed from Novu.`);
			return true
		} else {
			console.error(
				`Failed to remove subscriber ${subscriberId} from Novu.`,
			)
			return false
		}
	} catch (error) {
		console.error(
			`Error removing subscriber ${subscriberId} from Novu:`,
			error,
		)
		return false
	}
}

const novu = new Novu({
	secretKey: process.env.NOVU_SECRET_KEY,
})

export async function triggerNotificationSendToAdmin(
	orgId: string,
	workflow: string,
	payload?: PayloadType,
) {
	let adminUserIds: string[]
	if (!orgId.startsWith('user')) {
		const membersOfOrg = await getOrgMembers(orgId)
		const adminMembers = membersOfOrg.filter(
			(member) => member.role === 'org:admin',
		)
		adminUserIds = adminMembers.map((admin) => admin.userId)
	} else {
		adminUserIds = [orgId]
	}

	const novuSubscriberIds = await getNovuIds(adminUserIds)
	const adminSubscriberIds = Object.values(novuSubscriberIds).filter(
		(id) => id !== null,
	)
	//TODO: Maybe this try catch can go and would be better to find the error higher instead of ending here
	try {
		await novu.trigger({
			workflowId: workflow,
			to: adminSubscriberIds.map((subscriberId) => ({ subscriberId })),
			payload: payload,
		})
		// console.log("Result for send notification: ", result)
	} catch (error) {
		console.error(error)
	}
}

export async function triggerNovuEvent(
	workFlow: string,
	recipient: string,
	payload: PayloadType,
) {
	await novu.trigger({
		workflowId: workFlow,
		to: {
			subscriberId: recipient,
		},
		payload: payload,
	})
}

export async function sendWelcomeNotification(novuId: string) {
	try {
		await novu.trigger({
			workflowId: 'hello-from-landscape-friend',
			to: {
				subscriberId: novuId,
			},
			payload: {},
		})
	} catch (error) {
		console.error(error)
	}
}

export async function createInvoicePayload(
	clientName: string | null | undefined,
	amount: number,
	invoiceId?: string,
): Promise<PayloadType> {
	console.log('amount: ', (amount / 100).toFixed(2))
	return {
		client: {
			name: clientName || 'Unknown Client',
		},
		invoice: {
			id: invoiceId,
			amount: `${(amount / 100).toFixed(2)}`,
		},
	}
}
