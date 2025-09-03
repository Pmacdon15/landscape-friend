'use server'
import { markYardServicedDb } from "@/lib/DB/db-clients";
import { isOrgAdmin } from "@/lib/utils/clerk";
import { schemaAssign, schemaMarkYardCut } from "@/lib/zod/schemas";
import { assignGrassCuttingDb } from "../DB/db-grass-cutting";

export async function markYardServiced(clientId: number, date: Date, snow = false) {
    const { isAdmin, orgId, userId } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");
    if (!orgId && !userId) throw new Error("Organization ID or User ID is missing.");

    const validatedFields = schemaMarkYardCut.safeParse({
        clientId: clientId,
        date: date
    });

    if (!validatedFields.success) throw new Error("Invalid input data");

    try {
        const result = await markYardServicedDb(validatedFields.data, (orgId || userId)!, snow)
        if (!result) throw new Error('Failed to update Client cut day');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

export async function assignGrassCutting(clientId: number, assignedTo: string) {
    const { isAdmin, orgId, userId } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");
    if (!orgId && !userId) throw new Error("Organization ID or User ID is missing.");

    const validatedFields = schemaAssign.safeParse({
        clientId: clientId,
        assignedTo: assignedTo
    });

    if (!validatedFields.success) throw new Error("Invalid input data");

    try {
        const result = await assignGrassCuttingDb(validatedFields.data, (orgId || userId)!)
        if (!result) throw new Error('Failed to update Client cut day');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}
