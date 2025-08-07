'use server'
import { toggleSnowClientDb } from "@/lib/db";
import { isOrgAdmin } from "@/lib/webhooks";
import { schemaToggleSnowClient } from "@/lib/zod/schemas";

export async function  toggleSnowClient(clientId: number) {
    const { isAdmin, orgId, userId } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");

    const validatedFields = schemaToggleSnowClient.safeParse({
        clientId: clientId,       
    });

    if (!validatedFields.success) throw new Error("Invalid input data");

    try {
        const result = await  toggleSnowClientDb(validatedFields.data, orgId || userId)
        if (!result) throw new Error('Failed to update Client cut day');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}