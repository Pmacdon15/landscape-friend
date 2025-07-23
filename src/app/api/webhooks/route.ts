import { handleOrganizationCreated, handleSubscriptionUpdate } from '@/lib/functions';
import { clerkClient } from '@clerk/nextjs/server';
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'

function isSubscriptionItem(data: any): data is { plan: { slug: string } } {
    return 'plan' in data && 'slug' in data.plan;
}

export async function POST(req: NextRequest) {
    try {
        const evt: any = await verifyWebhook(req, {
            signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
        })

        console.log(`Received webhook with event type: ${evt.type}`)
        console.log('Webhook payload:', evt.data)
        console.log('organization_id:', evt.data.payer?.organization_id)
        console.log("plan: ", evt.data.plan?.slug)

        if (evt.type === 'subscriptionItem.active') {
            if (isSubscriptionItem(evt.data)) {
                const plan = evt.data.plan.slug;
                const orgId = evt.data.payer?.organization_id

                if (orgId) {
                    await handleSubscriptionUpdate(orgId, plan);
                }
            }
        } else if (evt.type === "organization.created") {
            const orgId = evt.data.id
            await handleOrganizationCreated(orgId);
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