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
        console.log('Calling addNovuSubscriber with subscriberId:', subscriberId);
        const result = await addNovuSubscriber(subscriberId, userEmail, userName);
        if (!result) {
            console.error(`Failed to add user ${userId} to Novu.`);
        }
    }
}
export async function handleUserDeleted(userId: string) {
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Delete the user from the database
    const deleteResult = await sql`
        DELETE FROM users
        WHERE id = ${userId}
        RETURNING *;
    `;

    if (deleteResult.length > 0) {
        console.log(`User ${userId} deleted from database.`);

        // Remove the user from Novu
        const user = deleteResult[0];
        if (user.novu_subscriber_id) {
            const result = await removeNovuSubscriber(user.novu_subscriber_id);
            if (!result) {
                console.error(`Failed to remove user ${userId} from Novu.`);
            }
        }
    } else {
        console.log(`User ${userId} not found in database.`);
    }
}


async function removeNovuSubscriber(subscriberId: string) {
    try {
        const response = await fetch(`${process.env.NOVU_API_URL}/subscribers/${subscriberId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `ApiKey ${process.env.NOVU_API_KEY}`,
            },
        });

        if (response.ok) {
            console.log(`Subscriber ${subscriberId} removed from Novu.`);
            return true;
        } else {
            console.error(`Failed to remove subscriber ${subscriberId} from Novu.`);
            return false;
        }
    } catch (error) {
        console.error(`Error removing subscriber ${subscriberId} from Novu:`, error);
        return false;
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
        DELETE FROM organizations
        WHERE organization_id = ${orgId}        
    `;
}

export async function handleSubscriptionUpdate(orgId: string, plan: string) {
    // Placeholder for subscription update logic
    console.log(`Subscription update for organization ${orgId} with plan ${plan}`);
    // You would typically update your database here based on the subscription plan
}


