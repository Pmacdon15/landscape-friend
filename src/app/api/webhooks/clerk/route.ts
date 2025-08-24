import { handleOrganizationCreated, handleOrganizationDeleted, handleSubscriptionUpdate, handleUserCreated, handleUserDeleted } from '@/lib/webhooks/clerk-webhooks';
import { OrganizationCreatedEvent, SubscriptionItem, UserCreatedEvent, UserDeletedEvent, WebhookEvent } from '@/types/types-clerk';
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'

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
                        await tigggerNotifactionSendToAdmin(ordIg)
                    }
                }
                break;
            }

            case 'user.created': {
                const data = evt.data as UserCreatedEvent;
                const userId = data.id;
                const userName = `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.username || 'Personal Workspace';
                const userEmail = data.email_addresses[0]?.email_address;
                if (!userEmail) {
                    console.error('User created event without email address');
                    break;
                }
                await handleUserCreated(userId, userName, userEmail);
                await handleOrganizationCreated(userId, userName);
                break;
            }

            case 'organization.created': {
                const orgId = (evt.data as OrganizationCreatedEvent).id;
                const orgName = (evt.data as OrganizationCreatedEvent).name;
                await handleOrganizationCreated(orgId, orgName);
                break;
            }

            case 'user.deleted': {
                const id = (evt.data as UserDeletedEvent).id;
                await handleOrganizationDeleted(id);
                await handleUserDeleted(id)
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
        return new Response('Error', { status: 401 })
    }
}