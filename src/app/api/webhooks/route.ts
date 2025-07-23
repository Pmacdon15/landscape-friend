import { handleOrganizationCreated, handleSubscriptionUpdate } from '@/lib/functions';
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import { SubscriptionItem, OrganizationCreatedEvent, WebhookEvent } from '@/types/types'

function isSubscriptionItem(data: WebhookEvent['data']): data is SubscriptionItem {
    return 'plan' in data && 'slug' in data.plan;
}

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req, {
            signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
        }) 

        console.log("Webhook Type: ", evt.type)
      
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