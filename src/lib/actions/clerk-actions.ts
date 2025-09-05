'use server'
import { isOrgAdmin } from "@/lib/utils/clerk";

export async function getIsAdminAction(): Promise<boolean> {
    const { isAdmin } = await isOrgAdmin();
    return isAdmin;
}