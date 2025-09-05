import { inngest } from "./inngest";
import { getAllOrganizations } from "../DB/org-db";
import { getYardsCutLastMonth } from "../DB/grass-cutting-db";
import { getStripeInstanceUnprotected } from "../utils/stripe-utils";

const addMonthlyPayment = inngest.createFunction(
    { id: "add-monthly-cost", retries: 2 },
    { cron: "0 0 1 * *" }, // runs on the 1st of every month at 00:00
    async () => {
        const organizations = await getAllOrganizations();

        for (const org of organizations) {
            console.log('Processing organization:', org);

            const stripe = await getStripeInstanceUnprotected(org.organization_id);

            const clientsToCharge = await getYardsCutLastMonth(org.organization_id);

            for (const client of clientsToCharge) {
                if (!client.stripe_customer_id) {
                    console.warn(`Client ${client.client_id} has no stripe_customer_id. Skipping.`);
                    continue;
                }

                const amount = client.cut_count * client.price_per_cut * 100; // amount in cents

                try {
                    // Create a draft invoice
                    const invoice = await stripe.invoices.create({
                        customer: client.stripe_customer_id,
                        collection_method: 'send_invoice',
                        days_until_due: 30,
                        auto_advance: false, // Create a draft invoice
                    });

                    if (invoice.id) {
                        // Create an invoice item and attach it to the invoice
                        await stripe.invoiceItems.create({
                            customer: client.stripe_customer_id,
                            invoice: invoice.id,
                            amount: amount,
                            currency: 'cad',
                            description: `Lawn mowing service (${client.cut_count} cuts)`,
                        });

                        // Finalize the invoice
                        await stripe.invoices.finalizeInvoice(invoice.id, {
                            auto_advance: true
                        });
                    } else {
                        console.error(`Failed to create invoice for client ${client.client_id}.`);
                    }

                } catch (error) {
                    console.error(`Error creating invoice for client ${client.client_id}:`, error);
                }
            }
        }

        return { success: true };
    }
);

export const functions = [addMonthlyPayment];


