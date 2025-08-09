'use server'

import { updatedStripeAPIKeyDb } from "@/lib/db";
import { isOrgAdmin } from "@/lib/webhooks";
import { schemaUpdateAPI } from "@/lib/zod/schemas";

export async function updateStripeAPIKey({ formData }: { formData: FormData }) {
    const { isAdmin, orgId, userId } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");

    const validatedFields = schemaUpdateAPI.safeParse({
        APIKey: formData.get("api_key"),
    });

    if (!validatedFields.success) throw new Error("Invalid input data");

    try {        
        const result = await updatedStripeAPIKeyDb(validatedFields.data, orgId || userId)
        if (!result.success) throw new Error(result.message);
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}


