'use server'
import { toggleSnowClientDb, assignSnowClearingDb } from "@/lib/DB/db-clients";
import { isOrgAdmin } from "@/lib/utils/clerk";
import { schemaToggleSnowClient, schemaAssignSnowClearing } from "@/lib/zod/schemas";

export async function toggleSnowClient(clientId: number) {
    const { isAdmin, orgId, userId } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");
    if (!orgId && !userId) throw new Error("Organization ID or User ID is missing.");

    const validatedFields = schemaToggleSnowClient.safeParse({
        clientId: clientId,
    });

    if (!validatedFields.success) throw new Error("Invalid input data");

    try {
        const result = await toggleSnowClientDb(validatedFields.data, (orgId || userId)!)
        if (!result) throw new Error('Failed to update Client cut day');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

export async function assignSnowClearing(clientId: number, assignedTo: string) {
    const { isAdmin, orgId, userId } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");
    if (!orgId && !userId) throw new Error("Organization ID or User ID is missing.");

    const validatedFields = schemaAssignSnowClearing.safeParse({
        clientId: clientId,
        assignedTo: assignedTo
    });

    if (!validatedFields.success) throw new Error("Invalid input data");

    try {
        const result = await assignSnowClearingDb(validatedFields.data, (orgId || userId)!)
        if (!result) throw new Error('Failed to update Client cut day');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}
