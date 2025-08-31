'use server'
import { isOrgAdmin } from "@/lib/server-functions/clerk";

export async function getIsAdminAction(): Promise<boolean> {
    const { isAdmin } = await isOrgAdmin();
    return isAdmin;
}