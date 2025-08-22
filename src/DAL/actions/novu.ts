'use server'

import { Novu } from '@novu/api';
import { ChatOrPushProviderEnum } from "@novu/api/models/components";
import { fetchNovuId } from '../dal-user';

const novu = new Novu({
  secretKey: process.env.NOVU_SECRET_KEY,
});


export async function registerNovuDevice(token: string, userId: string) {
  const subscriberId = await fetchNovuId(userId)
  try {
    if (!token || !userId) {
      throw new Error('Missing token or userIdId');
    }

    await novu.subscribers.credentials.update(
      {
        providerId: ChatOrPushProviderEnum.Fcm,
        credentials: {
          deviceTokens: [token],
        },
      },
      userId
    );

    console.log(`Device token ${token} registered for subscriber ${subscriberId} with Novu.`);
    return { success: true, message: 'Device registered successfully' };
  } catch (error) {
    console.error('Error registering device with Novu:', error);
    return { success: false, error: (error as Error).message || 'Failed to register device with Novu' };
  }
}
