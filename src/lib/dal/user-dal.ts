import { UserNovuId } from "@/types/types-novu";
import { auth } from "@clerk/nextjs/server";
import { fetchUniqueIdDb } from "../DB/db-user";

export async function fetchNovuId(userId: string): Promise<UserNovuId | null> {
    await auth.protect();
    return await fetchUniqueIdDb(userId);
}