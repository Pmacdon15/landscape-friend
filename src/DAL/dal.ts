import { Client, Price } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";


export interface PaginatedClients {
    clients: Client[];
    totalPages: number;
}

export async function FetchAllClients(clientPageNumber: number): Promise<PaginatedClients | null> {
    const { orgId, userId } = await auth.protect();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const pageSize = Number(process.env.PAGE_SIZE) || 10;
    const offset = (clientPageNumber - 1) * pageSize;

    try {
        const result = await (sql`
        WITH clients_with_balance AS (
            SELECT 
            c.*,
            a.current_balance AS amount_owing
            FROM clients c
            LEFT JOIN accounts a ON c.id = a.client_id
            WHERE c.organization_id = ${orgId || userId}
        )
        SELECT 
            (SELECT COUNT(*) FROM clients c WHERE c.organization_id = ${orgId || userId}) AS total_count,
            c.*
        FROM clients_with_balance c
        LIMIT ${pageSize} OFFSET ${offset};
        `);        

        const totalCount = result.length > 0 ? result[0].total_count : 0;
        const totalPages = Math.ceil(totalCount / pageSize);
        const clients = result.map(({ total_count, ...client }) => client as Client);

        return { clients, totalPages };
    } catch (error) {
        console.error("Error fetching clients:", error);
        return null; // Return null or a default value
    }
}

export async function FetchPricePerCut(): Promise<Price | null> {
    const { orgId, userId } = await auth.protect();
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await sql`
        SELECT amount FROM price_per_cut
        WHERE organization_id = ${orgId || userId} 
        LIMIT 1;
    `;
    return result.length > 0 ? { price: result[0].amount } : null;
}