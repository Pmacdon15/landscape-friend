'use server'
import { isOrgAdmin } from "@/lib/clerk";

export async function getIsAdminAction(): Promise<boolean> {
    const { isAdmin } = await isOrgAdmin();
    return isAdmin;
}