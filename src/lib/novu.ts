'use server'
import { sayHello } from '@/DAL/dal-novu';
import { Novu } from '@novu/api';

const novu = new Novu({
    secretKey: process.env.NOVU_SECRET_KEY as string,
});


export async function addNovuSubscriber(
    subscriberId: string | { subscriberId: string; email?: string; userName?: string },
    email?: string,
    userName?: string
) {
    let subId: string;
    let subEmail: string | undefined;
    let subUserName: string | undefined;

    if (typeof subscriberId === 'object' && subscriberId !== null && 'subscriberId' in subscriberId) {
        subId = subscriberId.subscriberId;
        subEmail = subscriberId.email;
        subUserName = subscriberId.userName;
    } else if (typeof subscriberId === 'string') {
        subId = subscriberId;
        subEmail = email;
        subUserName = userName;
    } else {
        throw new Error('Invalid arguments passed to addNovuSubscriber');
    }

    console.log('Creating Novu subscriber with ID:', subId);
    const firstName = subUserName?.split(" ")[0] ?? ""
    const lastName = subUserName?.split(" ")[1] ?? ""

    const response = await novu.subscribers.create({
        subscriberId: subId,
        email: subEmail,
        firstName,
        lastName,
    })

    console.log("Response: ", response)

    await sayHello(subId)

    // Check if response has the expected subscriberId instead of result
    if (!response.result.subscriberId) throw new Error("Error subscribing to Novu")
    return true
};

