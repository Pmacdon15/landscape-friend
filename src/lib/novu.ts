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
    try {
        const response = await novu.subscribers.create({
            subscriberId,
            email,
            firstName,
            lastName,
        });
        console.log("Novu subscriber created: ", response);
    } catch (error) {
        console.error("Error adding Novu subscriber: ", error);
        throw error;
    }
};

