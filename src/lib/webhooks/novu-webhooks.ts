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


export async function tigggerNotifactionSendToAdmin(userId: string) {

}