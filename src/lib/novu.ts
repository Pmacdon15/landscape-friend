import { sayHello } from '@/DAL/dal/novu-dal';
import { Novu } from '@novu/api';
import { getOrgMembers } from './clerk';

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

export async function triggerNotificationSendToAdmin(orgId: string, workflow: string) {
    const membersOfOrg = await getOrgMembers(orgId);
    const adminMembers = membersOfOrg.filter((member) => { return member.role === 'org:admin'; });
    const adminSubscriberIds = adminMembers.map((admin) => admin.userId);

    try {
        await novu.trigger({
            workflowId: workflow, 
            to: adminSubscriberIds.map((subscriberId) => ({ subscriberId })),
            payload: {},
        });
    } catch (error) {
        console.error(error);
    }
}

