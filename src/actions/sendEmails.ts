'use server'
import { formatCompanyName, formatSenderEmailAddress, sendEmail } from '@/lib/resend';
import { schemaSendNewsLetter } from '@/lib/zod/schemas';
import { auth } from '@clerk/nextjs/server';

export async function sendEmailWithTemplate(
    formData: FormData,
    clientsEmails: string,
) {
    try {
        const { sessionClaims } = await auth.protect();

        if (!sessionClaims) {
            throw new Error('Invalid session claims');
        }

        const validatedFields = schemaSendNewsLetter.safeParse({
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

        return sendEmail(clientsEmails, String(sessionClaims.orgName || sessionClaims.userFullName), validatedFields.data);
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

