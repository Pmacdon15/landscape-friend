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
    console.log('Creating Novu subscriber with ID:', subscriberId);
    const firstName = userName?.split(" ")[0]
    const lastName = userName?.split(" ")[1]

    const response = await novu.subscribers.create({
        subscriberId,
        email,
        firstName,
        lastName,
    })

    console.log("Response: ", response)

    // await sayHello(subscriberId)

    // Check if response has the expected subscriberId instead of result
    if (!response.result) throw new Error("Error subscribing to Novu")
    return true
};

