import { Client, Price } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";


export async function FetchAllClients(clientPageNumber: number): Promise<Client[]> {
    console.log("client Page Number: ", clientPageNumber)
    const { orgId, userId } = await auth.protect();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await (sql`
        SELECT c.*, a.current_balance AS amount_owing
        FROM clients c
        JOIN accounts a ON c.id = a.client_id
        WHERE c.organization_id = ${orgId || userId};
    `) as Client[];
    return result;
}

export async function FetchPricePerCut(): Promise<Price | null> {
    const { orgId, userId } = await auth.protect();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await sql`
        SELECT amount FROM price_per_cut
        WHERE organization_id = ${orgId || userId} 
        LIMIT 1;
    `;
    console.log("result", result)
    return result.length > 0 ? { price: result[0].amount } : null;
}