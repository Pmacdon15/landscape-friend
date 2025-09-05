import { auth } from '@clerk/nextjs/server';
import { schemaCreateSubscription } from '@/lib/zod/schemas';
import { createStripeSubscription } from '@/lib/dal/stripe-subscription-dal'; // This will be created next

export async function createSubscriptionAction(formData: FormData) {
  const { orgId, userId } = auth();
  const organizationId = orgId || userId;

  if (!organizationId) {
    throw new Error("Unauthorized");
  }

  const parsed = schemaCreateSubscription.safeParse({
    clientName: formData.get('clientName'),
    clientEmail: formData.get('clientEmail'),
    phone_number: formData.get('phone_number'),
    address: formData.get('address'),
    serviceType: formData.get('serviceType'),
    price_per_month_grass: parseFloat(formData.get('price_per_month_grass') as string),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate') || undefined,
    notes: formData.get('notes') || undefined,
    organization_id: organizationId,
  });

  if (!parsed.success) {
    console.error("Validation Error:", parsed.error);
    throw new Error("Invalid form data");
  }

  try {
    const subscription = await createStripeSubscription(parsed.data);
    return { success: true, subscription };
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw new Error("Failed to create subscription");
  }
}
