import { handleOrganizationCreated, handleOrganizationDeleted, handleSubscriptionUpdate, handleUserCreated } from '@/lib/webhooks';
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import { SubscriptionItem, OrganizationCreatedEvent, WebhookEvent, UserCreatedEvent, UserDeletedEvent } from '@/types/types'

function isSubscriptionItem(data: WebhookEvent['data']): data is SubscriptionItem {
    return 'plan' in data && 'slug' in data.plan;
}

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req, {
            signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
        }) as WebhookEvent;

        console.log("Web Hook :", evt.type, " ", evt.data)
        switch (evt.type) {
            case 'subscriptionItem.active': {
                if (isSubscriptionItem(evt.data)) {
                    const plan = evt.data.plan.slug;
                    const orgId = evt.data.payer?.organization_id;
                    if (orgId) {
                        await handleSubscriptionUpdate(orgId, plan);
                    }
                }
                break;
            }

            case 'user.created': {
                const userId = (evt.data as UserCreatedEvent).id;
                const userName = (evt.data as UserCreatedEvent).name;
                const userEmail = (evt.data as UserCreatedEvent).email_addresses;
                await handleUserCreated(userId, userName || "", userEmail);
                await handleOrganizationCreated(userId, userName || "");
                break;
            }

            case 'organization.created': {
                const orgId = (evt.data as OrganizationCreatedEvent).id;
                const orgName = (evt.data as OrganizationCreatedEvent).name;
                await handleOrganizationCreated(orgId, orgName);
                break;
            }

            case 'user.deleted': {
                const orgId = (evt.data as UserDeletedEvent).id;
                await handleOrganizationDeleted(orgId);
                break;
            }

            case 'organization.deleted': {
                const orgId = (evt.data as OrganizationCreatedEvent).id;
                await handleOrganizationDeleted(orgId);
                break;
            }

            default:
                console.log(`Unhandled event type: ${evt.type}`);
                break;
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