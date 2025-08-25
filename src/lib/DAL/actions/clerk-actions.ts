'use server'
import { isOrgAdmin } from "@/lib/server-funtions/clerk";

export async function getIsAdminAction(): Promise<boolean> {
    const { isAdmin } = await isOrgAdmin();
    return isAdmin;
}