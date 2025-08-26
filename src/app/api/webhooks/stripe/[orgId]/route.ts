import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { fetchWebhookSecretDb } from '@/lib/DB/db-stripe';
import { getStripeInstance } from '@/lib/dal/stripe-dal';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ orgId: string }> }
) {
    const { orgId } = await params;

    if (!orgId) {
        return new NextResponse('Organization ID is required', { status: 400 });
    }

    const webhookSecretResult = await fetchWebhookSecretDb(orgId);
    if (!webhookSecretResult || !webhookSecretResult.webhook_secret) {
        return new NextResponse('Webhook secret not found for this organization', {
            status: 400,
        });
    }
    const webhookSecret = webhookSecretResult.webhook_secret;

    const body = await req.text();
    // Reverted to original and correct usage: headers() returns a Promise and needs to be awaited
    const sig = (await headers()).get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        const stripe = await getStripeInstance()
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Stripe Webhook Error: ${errorMessage}`); // Added detailed logging
        return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
    }

    console.log("event type: " , event)
    // Handle the event
    switch (event.type) {
        case 'invoice.paid':
            const invoicePaid = event.data.object as Stripe.Invoice;
            console.log('Payment received for invoice:', invoicePaid.id);
            // Add your business logic here for when an invoice is paid
            break;
        case 'checkout.session.completed':
            const checkoutSession = event.data.object as Stripe.Checkout.Session;
            console.log('Checkout session completed:', checkoutSession.id);
            // Add your business logic here for when a checkout session is completed
            break;
        // Add other event types to handle here
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ status: 'success' }, { status: 200 })
}
