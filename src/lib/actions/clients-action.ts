'use server'
import { countClientsByOrgId, deleteClientDB, deleteSiteMapDB, updateClientPricePerDb, updatedClientCutDayDb } from "@/lib/DB/clients-db";
import { getOrganizationSettings } from "@/lib/DB/org-db";
import { isOrgAdmin } from "@/lib/utils/clerk";
import { schemaAddClient, schemaUpdatePricePerMonth, schemaDeleteClient, schemaUpdateCuttingDay, schemaDeleteSiteMap } from "@/lib/zod/schemas";
import { triggerNotificationSendToAdmin } from "../utils/novu";

import { findOrCreateStripeCustomerAndLinkClient } from "../utils/stripe-utils";

export async function addClient(formData: FormData) {
    const { orgId, userId } = await isOrgAdmin();
    const organizationId = orgId || userId;
    if (!organizationId) throw new Error("Organization ID or User ID is missing.");

    const orgSettings = await getOrganizationSettings(organizationId);
    if (!orgSettings) throw new Error("Organization not found.");

    const clientCount = await countClientsByOrgId(organizationId);
    if (clientCount >= orgSettings.max_allowed_clients) {
        throw new Error("Maximum number of clients reached for this organization.");
    }

    const validatedFields = schemaAddClient.safeParse({
        full_name: formData.get("full_name"),
        phone_number: Number(formData.get("phone_number")),
        email_address: formData.get("email_address"),
        address: formData.get("address"),
        organization_id: organizationId
    });

    // console.log("validatedFields: ", validatedFields)
    if (!validatedFields.success) throw new Error("Invalid form data");

    try {
        const customerId = await findOrCreateStripeCustomerAndLinkClient(
            validatedFields.data.full_name,
            validatedFields.data.email_address,
            validatedFields.data.phone_number.toString(),
            validatedFields.data.address,
            organizationId
        );

        triggerNotificationSendToAdmin(organizationId, 'client-added', {
            client: {
                name: validatedFields.data.full_name,
                encodedName: encodeURIComponent(validatedFields.data.full_name)
            }
        })

        return { success: true, customerId: customerId || null };
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
        triggerNotificationSendToAdmin(orgId || userId!, 'client-deleted')
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

export async function updateClientPricePerMonth(clientId: number, price: number, snow: boolean) {
    const { isAdmin, orgId, userId } = await isOrgAdmin();
    if (!isAdmin) throw new Error("Not Admin");
    if (!orgId && !userId) throw new Error("Organization ID or User ID is missing.");

    const validatedFields = schemaUpdatePricePerMonth.safeParse({
        clientId: clientId,
        pricePerMonthGrass: snow ? undefined : price,
        pricePerMonthSnow: snow ? price : undefined,
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


export async function deleteSiteMap(clientId: number, siteMapId: number) {
    const { orgId, userId } = await isOrgAdmin()
    if (!orgId && !userId) throw new Error("Organization ID or User ID is missing.");

    const validatedFields = schemaDeleteSiteMap.safeParse({
        client_id: clientId,
        siteMap_id: siteMapId
    });

    if (!validatedFields.success) throw new Error("Invalid form data");

    try {
        const result = await deleteSiteMapDB(validatedFields.data, (orgId || userId)!)
        if (!result.success) throw new Error('Delete Client');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}