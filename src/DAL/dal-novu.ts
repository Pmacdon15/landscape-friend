import { Novu } from '@novu/api';

const novu = new Novu({
    secretKey: process.env.NOVU_SECRET_KEY,
});

export async function sayHello(novuId: string, email?: string, userName?: string) {
    try {
        const firstName = userName?.split(" ")[0]
        const lastName = userName?.split(" ")[1]
        const response = await novu.trigger({
            workflowId: 'hello-from-landscape-friend',
            to: {
                subscriberId: novuId,
                email,
                firstName,
                lastName,
                timezone: 'America/Edmonton',
            },
            payload: {},
        });
        console.log("response: ", response)

    } catch (error) {
        console.error(error);
        // return NextResponse.json({ error: 'Failed to trigger Novu workflow' }, { status: 500 });
    }
}