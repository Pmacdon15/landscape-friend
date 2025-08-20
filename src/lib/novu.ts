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
    console.log('subscriberId in addNovuSubscriber:', subscriberId);
    const firstName = userName?.split(" ")[0]
    const lastName = userName?.split(" ")[1]
    const response = await novu.subscribers.create({
        subscriberId,
        email,
        firstName,
        lastName,
    })

    await sayHello(subscriberId)
    if (!response.result) throw new Error("Error subcribing to nova")
    return true

};

