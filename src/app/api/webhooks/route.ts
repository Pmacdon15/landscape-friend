import { handleOrganizationCreated, handleOrganizationDeleted, handleSubscriptionUpdate } from '@/lib/functions';
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import { SubscriptionItem, OrganizationCreatedEvent, WebhookEvent, UserCreatedEvent } from '@/types/types'

function isSubscriptionItem(data: WebhookEvent['data']): data is SubscriptionItem {
    return 'plan' in data && 'slug' in data.plan;
}

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req, {
            signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
        }) as WebhookEvent;

        console.log("Web Hook :", evt.type, " ", evt.data)
        if (evt.type === 'subscriptionItem.active') {
            if (isSubscriptionItem(evt.data)) {
                const plan = evt.data.plan.slug;
                const orgId = evt.data.payer?.organization_id
                if (orgId) await handleSubscriptionUpdate(orgId, plan);
            }
        } else if (evt.type === "user.created") {
            const userId = (evt.data as UserCreatedEvent).id;
            handleOrganizationCreated(userId);
            console.log(`User created with ID: ${userId}`);
        } else if (evt.type === "organization.created") {
            const orgId = (evt.data as OrganizationCreatedEvent).id
            await handleOrganizationCreated(orgId);
        } else if (evt.type === "organization.deleted") {
            const orgId = (evt.data as OrganizationCreatedEvent).id
            await handleOrganizationDeleted(orgId);
        }

        return new Response('Webhook received', { status: 200 })
    } catch (err) {
        if (err instanceof Error) {
            console.error('Error :', err.message)
        } else {
            console.error('Error :', err)
        }
        return new Response('Error', { status: 400 })
    }
}