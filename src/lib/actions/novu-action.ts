'use server'
import { auth } from '@clerk/nextjs/server'
import { fetchNovuId } from '../dal/user-dal'
import { Novu } from '@novu/api'
import { ChatOrPushProviderEnum } from '@novu/api/models/components'

export async function fetchNovuIdAction(userId: string) {
	return await fetchNovuId(userId)
}

const novu = new Novu({
	secretKey: process.env.NOVU_SECRET_KEY,
})

interface ChannelSettingsDto {
	providerId: ChatOrPushProviderEnum
	credentials: {
		deviceTokens?: string[]
	}
}

export async function registerNovuDevice(token: string, userId: string) {
	await auth.protect()
	try {
		const subscriberId = await fetchNovuId(userId)

		if (!token || !userId) {
			console.warn(
				'Action: registerNovuDevice - Missing token or userId.',
			)
			throw new Error('Missing token or userId')
		}

		if (subscriberId?.UserNovuId) {
			const subscriber = await novu.subscribers.retrieve(
				subscriberId.UserNovuId,
			)

			// Get current device tokens for FCM
			const currentTokens =
				subscriber.result.channels?.find(
					(channel: ChannelSettingsDto) =>
						channel.providerId === ChatOrPushProviderEnum.Fcm,
				)?.credentials?.deviceTokens || []

			// Only add the new token if it's not already present
			const updatedTokens = currentTokens.includes(token)
				? currentTokens
				: [...currentTokens, token]

			await novu.subscribers.credentials.update(
				{
					providerId: ChatOrPushProviderEnum.Fcm,
					credentials: {
						deviceTokens: updatedTokens,
					},
				},
				subscriberId?.UserNovuId,
			)
		} else {
			console.warn(
				'Action: registerNovuDevice - No Novu subscriber ID found for user.',
			)
		}

		return { success: true, message: 'Device registered successfully' }
	} catch (error) {
		console.error(
			'Action: registerNovuDevice - Error registering device with Novu:',
			error,
		)
		return {
			success: false,
			error:
				(error as Error).message ||
				'Failed to register device with Novu',
		}
	}
}
