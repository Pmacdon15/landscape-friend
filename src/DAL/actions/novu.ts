'use server'

import { Novu } from '@novu/api';
import { ChatOrPushProviderEnum } from "@novu/api/models/components";
import { fetchNovuId } from '../dal-user';

const novu = new Novu({
  secretKey: process.env.NOVU_SECRET_KEY,
});

interface ChannelSettingsDto {
  providerId: ChatOrPushProviderEnum;
  credentials: {
    deviceTokens?: string[];
  };
}
export async function registerNovuDevice(token: string, userId: string) {
  const subscriberId = await fetchNovuId(userId)
  try {
    if (!token || !userId) {
      throw new Error('Missing token or userIdId');
    }
    if (subscriberId?.UserNovuId) {
      const subscriber = await novu.subscribers.retrieve(subscriberId.UserNovuId);

      // Get current device tokens for FCM
      const currentTokens = subscriber.result.channels?.find(
        (channel: ChannelSettingsDto) => channel.providerId === ChatOrPushProviderEnum.Fcm
      )?.credentials?.deviceTokens || [];
      // Only add the new token if it's not already present
      const updatedTokens = currentTokens.includes(token)
        ? currentTokens
        : [...currentTokens, token];
console.log("current tokens: ", currentTokens)
      const result = await novu.subscribers.credentials.update(
        {
          providerId: ChatOrPushProviderEnum.Fcm,
          credentials: {
            deviceTokens: updatedTokens,
          },
        },
        subscriberId?.UserNovuId
      );
      console.log("result: ", result)
    }

    console.log(`Device token ${token} registered for subscriber ${subscriberId?.UserNovuId} with Novu.`);
    return { success: true, message: 'Device registered successfully' };
  } catch (error) {
    console.error('Error registering device with Novu:', error);
    return { success: false, error: (error as Error).message || 'Failed to register device with Novu' };
  }
}
