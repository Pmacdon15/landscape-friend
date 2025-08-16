'use server'
import { sendNewsLetterDb } from '@/lib/db';
import { formatCompanyName, formatSenderEmailAddress, sendEmail } from '@/lib/resend';
import { isOrgAdmin } from '@/lib/webhooks';
import { schemaSendEmail } from '@/lib/zod/schemas';
import { auth } from '@clerk/nextjs/server';

export async function sendEmailWithTemplate(
    formData: FormData,
    clientsEmails: string,
    attachments?: { filename: string; content: Buffer | string; }[]
) {
    try {
        const { sessionClaims } = await auth.protect();

        if (!sessionClaims) {
            throw new Error('Invalid session claims');
        }

        const validatedFields = schemaSendEmail.safeParse({
            title: formData.get("title"),
            message: formData.get("message"),
            sender: formatSenderEmailAddress({ orgName: sessionClaims.orgName as string, userFullName: sessionClaims.userFullName as string }),
            senderName: formatCompanyName({ orgName: sessionClaims.orgName as string, userFullName: sessionClaims.userFullName as string }),
            replyTo: sessionClaims.userEmail
        });
        if (!validatedFields.success) throw new Error("Invalid form data");

        if (!clientsEmails.length) {
            throw new Error('No client emails provided');
        }

        return sendEmail(clientsEmails, String(sessionClaims.orgName || sessionClaims.userFullName), validatedFields.data, attachments);
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}


export async function sendNewsLetter(formData: FormData) {
    const { isAdmin, sessionClaims, userId } = await isOrgAdmin();

    if (!isAdmin) throw new Error("Not Admin");
    if (!sessionClaims) throw new Error("Session claims are missing.");
    if (!sessionClaims.orgId && !userId) throw new Error("Organization ID or User ID is missing.");

    const validatedFields = schemaSendEmail.safeParse({
        title: formData.get("title"),
        message: formData.get("message"),
        sender: sessionClaims.userEmail,
        senderName: sessionClaims.userFullName
    });

    if (!validatedFields.success) throw new Error("Invalid form data");

    try {
        const result = await sendNewsLetterDb(validatedFields.data, sessionClaims, userId!)
        if (!result) throw new Error('Failed to Send News Letter');
        return result;
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        throw new Error(errorMessage);
    }
}

