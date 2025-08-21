'use server'
import { sayHello } from '@/DAL/dal-novu';
import { Novu } from '@novu/api';
import { v4 as uuidv4 } from 'uuid';
const novu = new Novu({
    secretKey: process.env.NOVU_SECRET_KEY as string,
});


export async function addNovuSubscriber(   
    email?: string,
    userName?: string
) {

    // console.log('Creating Novu subscriber with ID:', subId);
    // const firstName = subUserName?.split(" ")[0] ?? ""
    // const lastName = subUserName?.split(" ")[1] ?? ""
    const subscriberId = uuidv4();
    const response = await novu.subscribers.create({
        subscriberId: subscriberId,
    })

    console.log("Response: ", response)

    await sayHello(subscriberId)

    // Check if response has the expected subscriberId instead of result
    if (!response.result.subscriberId) throw new Error("Error subscribing to Novu")
    return true
};

