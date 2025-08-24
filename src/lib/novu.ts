import { sayHello } from '@/DAL/dal/novu-dal';
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

export async function removeNovuSubscriber(subscriberId: string) {
    try {
        const response = await fetch(`${process.env.NOVU_API_URL}/subscribers/${subscriberId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `ApiKey ${process.env.NOVU_API_KEY}`,
            },
        });

        if (response.ok) {
            console.log(`Subscriber ${subscriberId} removed from Novu.`);
            return true;
        } else {
            console.error(`Failed to remove subscriber ${subscriberId} from Novu.`);
            return false;
        }
    } catch (error) {
        console.error(`Error removing subscriber ${subscriberId} from Novu:`, error);
        return false;
    }
}


const novu = new Novu({
    secretKey: process.env.NOVU_SECRET_KEY,
});

export async function tigggerNotifactionSendToAdmin(orgId: string){

    const membersOfOrg = await fetch
    try {
        await novu.trigger({
            workflowId: "",
            to: "",
            payload: {},
        });

    } catch (error) {
        console.error(error);
        // return NextResponse.json({ error: 'Failed to trigger Novu workflow' }, { status: 500 });
    }
}
