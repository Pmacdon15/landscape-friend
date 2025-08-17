'use server'
import { addClientDB, countClientsByOrgId, deleteClientDB,  updateClientPricePerDb, updatedClientCutDayDb } from "@/lib/DB/db-clients";
import { getOrganizationSettings } from "@/lib/DB/db-org";
import { isOrgAdmin } from "@/lib/webhooks";
import { schemaAddClient, schemaUpdatePricePerCut, schemaDeleteClient, schemaUpdateCuttingDay } from "@/lib/zod/schemas";

export async function addClient(formData: FormData) {
    const { orgId, userId } = await isOrgAdmin();
    const organizationId = orgId || userId;
    if (!organizationId) throw new Error("Organization ID or User ID is missing.");

    const orgSettings = await getOrganizationSettings(organizationId);
    if (!orgSettings) throw new Error("Organization not found.");

    const clientCount = await countClientsByOrgId(organizationId);
    if (clientCount >= orgSettings.max_allowed_clinents) {
        throw new Error("Maximum number of clients reached for this organization.");
    }

    const validatedFields = schemaAddClient.safeParse({
        full_name: formData.get("full_name"),
        phone_number: Number(formData.get("phone_number")),
        email_address: formData.get("email_address"),
        address: formData.get("address"),
    });

    if (!validatedFields.success) throw new Error("Invalid form data");

    try {
        const result = await addClientDB(validatedFields.data, organizationId)
        if (!result) throw new Error('Failed to add Client');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

export async function deleteClient(clientId: number) {
    const { orgId, userId } = await isOrgAdmin()
    if (!orgId && !userId) throw new Error("Organization ID or User ID is missing.");

    const validatedFields = schemaDeleteClient.safeParse({
        client_id: clientId
    });

    if (!validatedFields.success) throw new Error("Invalid form data");

    try {
        const result = await deleteClientDB(validatedFields.data, (orgId || userId)!)
        if (!result) throw new Error('Delete Client');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

export async function updateClientPricePer(clientId: number, pricePerCut: number, snow: boolean) {
    const { isAdmin, orgId, userId } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");
    if (!orgId && !userId) throw new Error("Organization ID or User ID is missing.");

    const validatedFields = schemaUpdatePricePerCut.safeParse({
        clientId: clientId,
        pricePerCut: pricePerCut,
        snow: snow
    });

    if (!validatedFields.success) throw new Error("Invalid input data");

    try {
        const result = await updateClientPricePerDb(validatedFields.data, (orgId || userId)!)
        if (!result) throw new Error('Failed to update Client price per');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

export async function updateCuttingDay(clientId: number, cuttingWeek: number, updatedDay: string) {
    const { isAdmin, orgId, userId } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");
    if (!orgId && !userId) throw new Error("Organization ID or User ID is missing.");

    const validatedFields = schemaUpdateCuttingDay.safeParse({
        clientId: clientId,
        cuttingWeek: cuttingWeek,
        updatedDay: updatedDay
    });

    if (!validatedFields.success) throw new Error("Invalid input data");

    try {
        const result = await updatedClientCutDayDb(validatedFields.data, (orgId || userId)!)
        if (!result) throw new Error('Failed to update Client cut day');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

