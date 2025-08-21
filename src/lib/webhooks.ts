import { neon } from "@neondatabase/serverless"
import { addNovuSubscriber } from "./novu";
import { v4 as uuidv4 } from 'uuid';

export async function handleUserCreated(userId: string, userName: string, userEmail: string) {
    console.log('userId in handleUserCreated:', userId);
    const sql = neon(`${process.env.DATABASE_URL}`);

    const subscriberId = uuidv4();
    // Insert user, and do nothing if the user already exists.
    const insertResult = await sql`
        INSERT INTO users (id, name, email, novu_subscriber_id)
        VALUES (${userId}, ${userName}, ${userEmail}, ${subscriberId})
        ON CONFLICT (id) DO NOTHING
        RETURNING *;
    `;

    // Only if a new user was created, add them to Novu.
    if (insertResult.length > 0) {
        const result = await addNovuSubscriber(subscriberId, userEmail, userName);
        if (!result) {
            console.error(`Failed to add user ${userId} to Novu.`);
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


