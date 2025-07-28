'use server'
import { markYardCutDb } from "@/lib/db";
import { isOrgAdmin } from "@/lib/webhooks";
import { schemaMarkYardCut } from "@/lib/zod/schemas";

export async function markYardCut(clientId: number, date: Date) {
    const { isAdmin, orgId, userId } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");

    const validatedFields = schemaMarkYardCut.safeParse({
        clientId: clientId,
        date: date
    });

    if (!validatedFields.success) throw new Error("Invalid input data");

    try {
        const result = await markYardCutDb(validatedFields.data, orgId || userId)
        if (!result) throw new Error('Failed to update Client cut day');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}