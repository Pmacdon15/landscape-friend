import { Novu } from '@novu/api';

const novu = new Novu({
    secretKey: process.env.NOVU_SECRET_KEY,
});

export async function sayHello(novuId: string) {
    try {
        const response = await novu.trigger({
            workflowId: 'hello-from-landscape-friend',
            to: {
                subscriberId: novuId,
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