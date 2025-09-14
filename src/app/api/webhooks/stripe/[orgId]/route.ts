import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { fetchWebhookSecretDb } from '@/lib/DB/stripe-db';
import { getStripeInstanceUnprotected } from '@/lib/utils/stripe-utils';
import { handleInvoicePaid, handleInvoiceSent } from '@/lib/webhooks/stripe-webhooks';
import { createInvoicePayload, triggerNotificationSendToAdmin } from '@/lib/utils/novu';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ orgId: string }> }
) {
    const { orgId } = await params;

    if (!orgId) return new NextResponse('Organization ID is required', { status: 400 });

    const webhookSecretResult = await fetchWebhookSecretDb(orgId);
    if (!webhookSecretResult || !webhookSecretResult.webhook_secret) {
        return new NextResponse('Webhook secret not found for this organization', { status: 400, });
    }

    const webhookSecret = webhookSecretResult.webhook_secret;

    const body = await req.text();

    const sig = (await headers()).get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        const stripe = await getStripeInstanceUnprotected(orgId)
        if (!stripe) {
            throw new Error('Failed to get Stripe instance');
        }
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Stripe Webhook Error: ${errorMessage}`); // Added detailed logging
        return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
    }
    
    console.log("event type: ", event)
    try {

        switch (event.type) {
            case 'invoice.paid':
                const invoicePaid = event.data.object as Stripe.Invoice;
                const payloadPaid = await createInvoicePayload(invoicePaid.customer_name, invoicePaid.amount_paid, invoicePaid.id);
                await handleInvoicePaid(invoicePaid, orgId);
                await triggerNotificationSendToAdmin(orgId, 'invoice-paid', payloadPaid)
                break;
            case 'invoice.sent':
                const invoiceSent = event.data.object as Stripe.Invoice;
                const payloadSent = await createInvoicePayload(invoiceSent.customer_name, invoiceSent.amount_due, invoiceSent.id);
                await handleInvoiceSent(invoiceSent, orgId);
                await triggerNotificationSendToAdmin(orgId, 'invoice-sent', payloadSent)
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (e) {
        console.error("Error", e)
        return NextResponse.json({ status: 'fail' }, { status: 400 })
    }
    return NextResponse.json({ status: 'success' }, { status: 200 })
}
