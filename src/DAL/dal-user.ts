import { UserNovuId } from "@/types/types-novu";
import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function fetchNovuId(userId: string):
    Promise<UserNovuId | null> {    
    const sql = neon(`${process.env.DATABASE_URL} `);
    const result = await sql` SELECT novu_subscriber_id FROM users where id = ${userId} `;
    if (result.length > 0) {
        return { UserNovuId: result[0].novu_id };
    }
    return null;
}