import Stripe from 'stripe';
import { schemaCreateSubscription } from '@/lib/zod/schemas';
import { z } from 'zod';
import { createStripeCustomer, getStripeCustomerByEmail } from '../utils/stripe-utils';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function createStripeSubscription(subscriptionData: z.infer<typeof schemaCreateSubscription>) {
  const { clientEmail, clientName, address, phone_number, price_per_month_grass, serviceType, startDate, endDate, organization_id } = subscriptionData;

  let customerId: string;

  // 1. Check for existing Stripe customer or create a new one
  let customer = await getStripeCustomerByEmail(clientEmail);

  if (!customer) {
    customer = await createStripeCustomer({
      email: clientEmail,
      name: clientName,
      address: { line1: address },
      phone: phone_number,
      metadata: { organization_id: organization_id },
    });
    customerId = customer.id;
  } else {
    customerId = customer.id;
  }

  // 2. Create a Stripe Product and Price for the subscription
  // This assumes a simple product/price model. For more complex scenarios, you might pre-create these.
  const productName = `Lawn Mowing - ${serviceType} for ${clientName}`;
  const product = await stripe.products.create({
    name: productName,
    type: 'service',
    metadata: { organization_id: organization_id, serviceType: serviceType },
  });

  const price = await stripe.prices.create({
    unit_amount: Math.round(price_per_month_grass * 100), // Convert to cents
    currency: 'cad',
    recurring: { interval: 'month' },
    product: product.id,
    metadata: { organization_id: organization_id, serviceType: serviceType },
  });

  // 3. Create the Stripe Subscription
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: price.id }],
    collection_method: 'charge_automatically',
    days_until_due: 7, // Example: invoice 7 days before renewal
    metadata: {
      organization_id: organization_id,
      clientEmail: clientEmail,
      serviceType: serviceType,
      startDate: startDate,
      endDate: endDate || '' // Store endDate if available
    },
  });

  // TODO: Save subscription details to your local database if needed

  return subscription;
}
