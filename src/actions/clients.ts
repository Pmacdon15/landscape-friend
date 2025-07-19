'use server'
import { addClientDB } from "@/lib/db";
import { schemaAddClient } from "@/lib/zod/schemas";

import { auth } from "@clerk/nextjs/server";

export async function addClient(formData: FormData) {
    const { orgId, userId } = await auth.protect()

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



