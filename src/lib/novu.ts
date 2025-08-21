'use server'
import { sayHello } from '@/DAL/dal-novu';
import { Novu } from '@novu/api';

const novu = new Novu({
    secretKey: process.env.NOVU_SECRET_KEY as string,
});


export async function addNovuSubscriber(
    subscriberId: string,
    email?: string,
    userName?: string
) {
    console.log('addNovuSubscriber called with:', { subscriberId, email, userName });
    await sayHello(subscriberId, email, userName)
    return true
};

