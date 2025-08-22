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
  console.log('registerNovuDevice Server Action received:');
  console.log('  Token:', token);
  console.log('  User ID:', userId);

  const subscriberId = await fetchNovuId(userId)
  try {
    if (!token || !userId) {
      throw new Error('Missing token or userIdId');
    }
    if (subscriberId?.UserNovuId) {
      console.log('Novu Subscriber ID:', subscriberId.UserNovuId);
      const subscriber = await novu.subscribers.retrieve(subscriberId.UserNovuId);
      console.log('Existing Novu subscriber data:', subscriber);

      // Get current device tokens for FCM
      const currentTokens = subscriber.result.channels?.find(
        (channel: ChannelSettingsDto) => channel.providerId === ChatOrPushProviderEnum.Fcm
      )?.credentials?.deviceTokens || [];
      console.log('Current FCM device tokens in Novu:', currentTokens);

      // Only add the new token if it's not already present
      const updatedTokens = currentTokens.includes(token)
        ? currentTokens
        : [...currentTokens, token];
      console.log("Updated tokens to send to Novu: ", updatedTokens);

      const result = await novu.subscribers.credentials.update(
        {
          providerId: ChatOrPushProviderEnum.Fcm,
          credentials: {
            deviceTokens: updatedTokens,
          },
        },
        subscriberId?.UserNovuId
      );
      console.log("Novu credentials update result: ", result)
    }

    console.log(`Device token ${token} registered for subscriber ${subscriberId?.UserNovuId} with Novu.`);
    return { success: true, message: 'Device registered successfully' };
  } catch (error) {
    console.error('Error registering device with Novu:', error);
    return { success: false, error: (error as Error).message || 'Failed to register device with Novu' };
  }
}
