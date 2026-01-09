'use server'
import type z from 'zod'
import {
	addClientDB,
	countClientsByOrgId,
	deleteClientDB,
	deleteSiteMapDB,
	updateClientPricePerDb,
	updatedClientCutDayDb,
} from '@/lib/DB/clients-db'
import { getOrganizationSettings } from '@/lib/DB/org-db'
import { isOrgAdmin } from '@/lib/utils/clerk'
import {
	schemaDeleteClient,
	schemaDeleteSiteMap,
	schemaUpdateCuttingDay,
	schemaUpdatePricePerMonth,
} from '@/lib/zod/schemas'
import { triggerNotificationSendToAdmin } from '../utils/novu'
import {
	createOrUpdateStripeUser,
	findOrCreateStripeCustomer,
} from '../utils/stripe-utils'
import { AddClientFormSchema } from '../zod/client-schemas'

export async function addClient(data: z.infer<typeof AddClientFormSchema>) {
	const { isAdmin, orgId, userId } = await isOrgAdmin(true)
	const organizationId = orgId || userId
	if (!organizationId)
		return {
			errorMessage: 'Not logged in',
		}
	if (!isAdmin)
		return {
			errorMessage: 'Not Admin.',
		}

	const orgSettings = await getOrganizationSettings(organizationId)
	if (!orgSettings)
		return {
			errorMessage: 'Organization not found.',
		}

	const clientCount = await countClientsByOrgId(organizationId)
	if (clientCount >= orgSettings.max_allowed_clients) {
		return {
			errorMessage:
				'Maximum number of clients reached consider plan upgrade.',
		}
	}

	const validatedFields = AddClientFormSchema.safeParse(data)

	if (!validatedFields.success) {
		return {
			errorMessage: 'Invalid form data',
		}
	}

	try {
		const customerId = await findOrCreateStripeCustomer(
			validatedFields.data.full_name,
			validatedFields.data.email_address,
			organizationId,
		)

		const result = await addClientDB(
			{
				...validatedFields.data,
				stripe_customer_id: customerId || null,
				organization_id: organizationId,
			},
			organizationId,
		)

		if (!result) {
			throw new Error('Failed to add client to database')
		}

		triggerNotificationSendToAdmin(organizationId, 'client-added', {
			client: {
				name: validatedFields.data.full_name,
				encodedName: encodeURIComponent(validatedFields.data.full_name),
			},
		})

		return { success: true, customerId: customerId || null }
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		console.error(errorMessage)
		return {
			errorMessage: 'Error adding client',
		}
	}
}

export async function updateClient(
	data: z.infer<typeof AddClientFormSchema>,
	clientId: number,
) {
	const { isAdmin, orgId, userId } = await isOrgAdmin(true)
	const organizationId = orgId || userId
	if (!organizationId)
		return {
			errorMessage: 'Not logged in.',
		}
	if (!isAdmin)
		return {
			errorMessage: 'Not Admin.',
		}
	//TODO: address update is not implemented
	const validatedFields = AddClientFormSchema.safeParse(data)

	console.log('validatedFields: ', validatedFields)
	if (!validatedFields.success)
		return {
			errorMessage: 'Invalid form data.',
		}
	try {
		await createOrUpdateStripeUser(
			clientId,
			validatedFields.data.full_name,
			validatedFields.data.email_address,
			validatedFields.data.phone_number,
			validatedFields.data.addresses,
			organizationId,
		)
		return { success: true }
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		console.error(errorMessage)
		return {
			errorMessage: 'Error updating client.',
		}
	}
}

export async function deleteClient(clientId: number) {
	const { orgId, userId } = await isOrgAdmin()
	if (!userId) throw new Error('User ID is missing.')

	const validatedFields = schemaDeleteClient.safeParse({
		client_id: clientId,
	})

	if (!validatedFields.success) throw new Error('Invalid form data')

	try {
		const result = await deleteClientDB(
			validatedFields.data,
			orgId || String(userId),
		)
		if (!result) throw new Error('Delete Client')
		triggerNotificationSendToAdmin(
			orgId || String(userId),
			'client-deleted',
		)
		return result
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		throw new Error(errorMessage)
	}
}

export async function updateClientPricePerMonth(
	clientId: number,
	price: number,
	snow: boolean,
) {
	const { isAdmin, orgId, userId } = await isOrgAdmin()
	if (!isAdmin) throw new Error('Not Admin')
	if (!userId) throw new Error('User ID is missing.')

	const validatedFields = schemaUpdatePricePerMonth.safeParse({
		clientId: clientId,
		pricePerMonthGrass: snow ? undefined : price,
		pricePerMonthSnow: snow ? price : undefined,
		snow: snow,
	})

	if (!validatedFields.success) throw new Error('Invalid input data')

	try {
		const result = await updateClientPricePerDb(
			validatedFields.data,
			orgId || String(userId),
		)
		if (!result) throw new Error('Failed to update Client price per')
		return result
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		throw new Error(errorMessage)
	}
}

export async function updateCuttingDay(
	addressId: number,
	cuttingWeek: number,
	updatedDay: string,
) {
	const { isAdmin, userId } = await isOrgAdmin(true)
	if (!isAdmin) throw new Error('Not Admin')
	if (!userId) throw new Error('User ID is missing.')

	const validatedFields = schemaUpdateCuttingDay.safeParse({
		addressId: addressId,
		cuttingWeek: cuttingWeek,
		updatedDay: updatedDay,
	})

	if (!validatedFields.success) throw new Error('Invalid input data')

	try {
		const result = await updatedClientCutDayDb(
			validatedFields.data,
			// orgId || String(userId),
		)
		if (!result) throw new Error('Failed to update Client cut day')
		return result
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		throw new Error(errorMessage)
	}
}

export async function deleteSiteMap(clientId: number, siteMapId: number) {
	const { orgId, userId } = await isOrgAdmin()
	if (!userId) throw new Error('Organization ID or User ID is missing.')

	const validatedFields = schemaDeleteSiteMap.safeParse({
		client_id: clientId,
		siteMap_id: siteMapId,
	})

	if (!validatedFields.success) throw new Error('Invalid form data')

	try {
		const result = await deleteSiteMapDB(
			validatedFields.data,
			orgId || String(userId),
		)
		if (!result.success) throw new Error('Delete Client')
		return result
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : String(e)
		throw new Error(errorMessage)
	}
}

export async function changePriority() {}
