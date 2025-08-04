'use server'
import { addClientDB, deleteClientDB, updatedClientPricePerCutDb, updatedClientServiceDayDb } from "@/lib/db";
import { isOrgAdmin } from "@/lib/webhooks";
import { schemaAddClient, schemaUpdatePricePerCut, schemaDeleteClient, schemaUpdateServiceDay } from "@/lib/zod/schemas";

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
    const { orgId, userId } = await isOrgAdmin()

    const validatedFields = schemaDeleteClient.safeParse({
        client_id: clientId
    });

    if (!validatedFields.success) throw new Error("Invalid form data");

    try {
        const result = await deleteClientDB(validatedFields.data, orgId || userId)
        if (!result) throw new Error('Delete Client');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

export async function updateClientPricePerCut(clientId: number, pricePerCut: number) {
    const { isAdmin, orgId, userId } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");

    const validatedFields = schemaUpdatePricePerCut.safeParse({
        clientId: clientId,
        pricePerCut: pricePerCut
    });

    if (!validatedFields.success) throw new Error("Invalid input data");

    try {
        const result = await updatedClientPricePerCutDb(validatedFields.data, orgId || userId)
        if (!result) throw new Error('Failed to update Client price per cut');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

export async function updateServiceDay(clientId: number, ServiceWeek: number, updatedDay: string) {
    const { isAdmin, orgId, userId } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");

    const validatedFields = schemaUpdateServiceDay.safeParse({
        clientId: clientId,
        ServiceWeek: ServiceWeek,
        updatedDay: updatedDay
    });

    if (!validatedFields.success) throw new Error("Invalid input data");

    try {
        const result = await updatedClientServiceDayDb(validatedFields.data, orgId || userId)
        if (!result) throw new Error('Failed to update Client cut day');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

