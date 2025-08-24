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
  // console.log(`Action: registerNovuDevice - Called with token: ${token ? 'present' : 'missing'}`);
  try {

    // console.log('Action: registerNovuDevice - Fetching Novu ID for user.');
    const subscriberId = await fetchNovuId(userId);
    // console.log(`Action: registerNovuDevice - Novu subscriberId: ${subscriberId?.UserNovuId}`);

    if (!token || !userId) {
      console.warn('Action: registerNovuDevice - Missing token or userId.');
      throw new Error('Missing token or userId');
    }

    if (subscriberId?.UserNovuId) {
      // console.log(`Action: registerNovuDevice - Retrieving subscriber with ID: ${subscriberId.UserNovuId}`);
      const subscriber = await novu.subscribers.retrieve(subscriberId.UserNovuId);
      // console.log('Action: registerNovuDevice - Subscriber retrieved successfully.');

      // Get current device tokens for FCM
      const currentTokens = subscriber.result.channels?.find(
        (channel: ChannelSettingsDto) => channel.providerId === ChatOrPushProviderEnum.Fcm
      )?.credentials?.deviceTokens || [];
      // console.log('Action: registerNovuDevice - Current FCM tokens:', currentTokens);

      // Only add the new token if it's not already present
      const updatedTokens = currentTokens.includes(token)
        ? currentTokens
        : [...currentTokens, token];
      // console.log('Action: registerNovuDevice - Updated FCM tokens:', updatedTokens);

      const result = await novu.subscribers.credentials.update(
        {
          providerId: ChatOrPushProviderEnum.Fcm,
          credentials: {
            deviceTokens: updatedTokens,
          },
        },
        subscriberId?.UserNovuId
      );
      // console.log('Action: registerNovuDevice - Novu API update result:', result);
    } else {
      // console.warn('Action: registerNovuDevice - No Novu subscriber ID found for user.');
    }

    // console.log(`Action: registerNovuDevice - Device token ${token} registered for subscriber ${subscriberId?.UserNovuId} with Novu.`);
    return { success: true, message: 'Device registered successfully' };
  } catch (error) {
    console.error('Action: registerNovuDevice - Error registering device with Novu:', error);
    return { success: false, error: (error as Error).message || 'Failed to register device with Novu' };
  }
}
