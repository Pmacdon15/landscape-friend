import { neon } from "@neondatabase/serverless"
import { addNovuSubscriber } from "./novu";
import { generateUniqueId } from "./uuid";


export async function handleUserCreated(userId: string, userName: string, userEmail: string) {
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Insert user, and do nothing if the user already exists.
    const insertResult = await sql`
        INSERT INTO users (id, name, email, novu_subscriber_id)
        VALUES (${userId}, ${userName}, ${userEmail}, ${userId})
        ON CONFLICT (id) DO NOTHING;
    `;

    // Only if a new user was created, add them to Novu.
    if (insertResult.length > 0) {
        const result = await addNovuSubscriber(userId, userEmail, userName);
        if (!result) {
            // If Novu subscription fails, we might want to roll back the user creation
            // or handle it in some other way, e.g., a retry queue.
            // For now, we'll just log an error.
            console.error(`Failed to add user ${userId} to Novu.`);
            // Optionally, re-throw the error if this is a critical failure
            // throw new Error(`Failed to add user ${userId} to Novu.`);
        }
    }
}

export async function handleOrganizationCreated(orgId: string, orgName: string) {
    const sql = neon(`${process.env.DATABASE_URL}`);
    await sql`
        INSERT INTO organizations (organization_id, organization_name)
        VALUES (${orgId}, ${orgName});               
    `;
}

export async function handleOrganizationDeleted(orgId: string) {
    const sql = neon(`${process.env.DATABASE_URL}`);
    await sql`
        DELETE FROM price_per_cut
        WHERE organization_id = ${orgId}        
    `;
}

export async function handleSubscriptionUpdate(orgId: string, plan: string) {
    // Placeholder for subscription update logic
    console.log(`Subscription update for organization ${orgId} with plan ${plan}`);
    // You would typically update your database here based on the subscription plan
}


