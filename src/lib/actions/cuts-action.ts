'use server'
import { markYardServicedDb } from "@/lib/DB/db-clients";
import { isOrgAdmin } from "@/lib/server-funtions/clerk";
import { schemaMarkYardCut } from "@/lib/zod/schemas";
import { uploadImageBlobServiceDone } from "../server-funtions/image-control";

export async function markYardServiced(clientId: number, date: Date, snow = false, image:File) {
    const { isAdmin, orgId, userId } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");
    if (!orgId && !userId) throw new Error("Organization ID or User ID is missing.");

    const validatedFields = schemaMarkYardCut.safeParse({
        clientId: clientId,
        date: date
    });

    if (!validatedFields.success) throw new Error("Invalid input data");

    let image_url;
    /// Try upload Image to Vercel Blob
    try {
        const result = await uploadImageBlobServiceDone((orgId || userId)!, clientId, image)
        if (!result) throw new Error('Failed to update Client cut day');
        image_url = result.url;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }

    // Try save information into Database
    try {
        const result = await markYardServicedDb(validatedFields.data, (orgId || userId)!, snow, image_url)
        if (!result) throw new Error('Failed to update Client cut day');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}