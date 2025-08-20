'use server'
import { Novu } from '@novu/node';

const novu = new Novu({
    secretKey: process.env.NOVU_SECRET_KEY as string,
});

export async function addNovuSubscriber(
    subscriberId: string,
    email: string,
    firstName?: string,
    lastName?: string
) {
    try {
        const response = await novu.subscribers.identify(subscriberId, {
            email: email,
            firstName: firstName,
            lastName: lastName,
        });
        console.log("Novu subscriber identified/created: ", response.data);
        return response.data.subscriberId;
    } catch (error) {
        console.error("Error adding Novu subscriber: ", error);
        throw error;
    }
}
