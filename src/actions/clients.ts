'use server'
import { addClientDB, deleteClientDB, sendNewsLetterDb } from "@/lib/db";
import { isOrgAdmin } from "@/lib/webhooks";
import { schemaAddClient, schemaDeleteClient, schemaSendNewsLetter } from "@/lib/zod/schemas";

export async function addClient(formData: FormData) {
    const { orgId, userId } = await isOrgAdmin();

    const validatedFields = schemaAddClient.safeParse({
        full_name: formData.get("full_name"),
        phone_number: Number(formData.get("phone_number")),
        email_address: formData.get("email_address"),
        address: formData.get("address"),
    });

    if (!validatedFields.success) throw new Error("Invalid form data");

    try {
        const result = await addClientDB(validatedFields.data, orgId || userId)
        if (!result) throw new Error('Failed to add Client');
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
        if (!result) throw new Error('Delete Client');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

export async function sendNewsLetter(formData: FormData) {
    const { isAdmin, sessionClaims, userId } = await isOrgAdmin();

    if (!isAdmin) throw new Error("Not Admin");

    const validatedFields = schemaSendNewsLetter.safeParse({
        title: formData.get("title"),
        message: formData.get("message"),
    });

    if (!validatedFields.success) throw new Error("Invalid form data");

    try {
        const result = await sendNewsLetterDb(validatedFields.data, sessionClaims, userId)
        if (!result) throw new Error('Failed to Send News Letter');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

