'use server'
import { hasStripAPIKey } from "../dal/stripe-dal";

export async function hasStripeApiKeyAction(): Promise<boolean> {
    return await hasStripAPIKey();
}