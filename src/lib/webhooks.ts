import { auth } from "@clerk/nextjs/server"
import { neon } from "@neondatabase/serverless"
import { addNovuSubscriber } from "./novu";

export async function isOrgAdmin(protect = true) {
    let authResult;
    if (protect) {
        authResult = await auth.protect();
    } else {
        authResult = await auth();
    }

    const { userId, orgId, sessionClaims } = authResult;
    let isAdmin = true;
    if (orgId && sessionClaims.orgRole !== "org:admin") isAdmin = false;

    return { userId, orgId, sessionClaims, isAdmin };
}

export async function handleUserCreated(userId: string, userName: string, userEmail: string) {
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Add user to Novu as a subscriber
    let novuSubscriberId: string | undefined;
    try {
        novuSubscriberId = await addNovuSubscriber(userId, userEmail, userName);
    } catch (error) {
        console.error("Failed to add Novu subscriber for user: ", userId, error);
        // Continue without Novu subscriber ID if it fails
    }

    await sql`
        INSERT INTO users (id, name, email)
        VALUES (${userId}, ${userName}, ${userEmail});               
    `;

    // Also create a client entry for the new user
    await sql`
        INSERT INTO clients (
            full_name,
            phone_number,
            email_address,
            organization_id,
            address,
            novu_subscriber_id
        )
        VALUES (
            ${userName},
            'N/A', -- Placeholder for phone_number
            ${userEmail},
            ${userId}, -- Using userId as organization_id for the client
            'N/A', -- Placeholder for address
            ${novuSubscriberId}
        );
    `;
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


