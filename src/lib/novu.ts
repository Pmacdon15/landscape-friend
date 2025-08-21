'use server'
import { sayHello } from '@/DAL/dal-novu';
import { Novu } from '@novu/api';

export async function addNovuSubscriber(
    subscriberId: string,
    email?: string,
    userName?: string
) {
    console.log('addNovuSubscriber called with:', { subscriberId, email, userName });
    await sayHello(subscriberId, email, userName)
    return true
};

