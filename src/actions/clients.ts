'use server'
import { addClientDB, deleteClientDB, sendNewsLetterDb } from "@/lib/db";
import { isOrgAdmin } from "@/lib/functions";
import { schemaAddClient, schemaDeleteClient, schemaSendNewsLetter } from "@/lib/zod/schemas";

export async function addClient(formData: FormData) {
    const { orgId, userId } = await isOrgAdmin();

    const validatedFields = schemaAddClient.safeParse({
        full_name: formData.get("full_name"),
        email_address: formData.get("email_address"),
        address: formData.get("address"),
    });

    if (!validatedFields.success) throw new Error("Invalid form data");

    try {
        const result = await addClientDB(validatedFields.data, orgId || userId)
        if (!result) throw new Error('Failed to add to inventory');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

export async function deleteClient(clientId: number) {
    await isOrgAdmin()

    const validatedFields = schemaDeleteClient.safeParse({
        client_id: clientId
    });

    if (!validatedFields.success) throw new Error("Invalid form data");

    try {
        const result = await deleteClientDB(validatedFields.data)
        if (!result) throw new Error('Failed to add to inventory');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

export async function sendNewsLetter(formData: FormData) {
    const { orgId, userId , isAdmin} = await isOrgAdmin();

    if(!isAdmin) throw new Error("Not Admin");

    const validatedFields = schemaSendNewsLetter.safeParse({
        title: formData.get("title"),
        message: formData.get("message"),
    });

    if (!validatedFields.success) throw new Error("Invalid form data");

    try {
        const result = await sendNewsLetterDb(validatedFields.data, orgId || userId)
        if (!result) throw new Error('Failed to add to inventory');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

