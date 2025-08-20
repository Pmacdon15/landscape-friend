'use server'
import { Novu } from '@novu/api';

const novu = new Novu({
    secretKey: process.env.NOVU_SECRET_KEY as string,
});


export async function addNovuSubscriber(
    subscriberId: string,
    email: string,
    firstName?: string,
    lastName?: string
) {

    const response = await novu.subscribers.create({
        subscriberId,
        email,
        firstName,
        lastName,
    })
    if (!response.result) throw new Error("Error subcribing to nova")
    return true

};

