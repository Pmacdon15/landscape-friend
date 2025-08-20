import { auth } from "@clerk/nextjs/server"
import { neon } from "@neondatabase/serverless"
import { addNovuSubscriber } from "./novu";
import { generateUniqueId } from "./uuid";

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
    const subscriberId = generateUniqueId()
    const reuslt = await addNovuSubscriber(userId, userEmail, userName);
    if (!reuslt) throw new Error("Error subscribing to novu")
    const secondResult = await sql`
        INSERT INTO users (id, name, email, novu_subscriber_id)
        VALUES (${userId}, ${userName}, ${userEmail}, ${subscriberId});               
    `;
    if (secondResult.length < 1) throw new Error("Erro adding user to db")
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


