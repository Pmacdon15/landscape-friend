'use server'
import HeaderEmail from '@/components/ui/emails/header-email';
import { schemaSendNewsLetter } from '@/lib/zod/schemas';
import { auth } from '@clerk/nextjs/server';

import { Resend } from 'resend';
import z from 'zod';

export async function sendEmail(companyName: string, clientsEmails: string[], data: z.infer<typeof schemaSendNewsLetter>) {
    const { sessionClaims } = await auth.protect()

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        resend.emails.send({
            from: `${companyName}@lawn-buddy.patmac.ca`,
            to: clientsEmails,
            subject: data.title,
            html: data.message,
            replyTo: `${sessionClaims.userEmail}`
        });
    } catch (e) {
        console.error(e, "Error sending email")
        return false
    }
    return true
}

export async function sendEmailWithTemplate(
    formData: FormData,
    clientsEmails: string[],
) {
    try {
        const { sessionClaims } = await auth.protect();

        if (!sessionClaims) {
            throw new Error('Invalid session claims');
        }

        const validatedFields = schemaSendNewsLetter.safeParse({
            title: formData.get("title"),
            message: formData.get("message"),
        });
        if (!validatedFields.success) throw new Error("Invalid form data");

        // Initialize Resend client
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Validate clientsEmails
        if (!clientsEmails.length) {
            throw new Error('No client emails provided');
        }

        // Send email using Resend
        const response = await resend.emails.send({
            from: `${(sessionClaims.orgName as string || sessionClaims?.userFullName as string || 'Your Landscaper').replace(/\s+/g, '-')}@lawn-buddy.patmac.ca`,
            to: clientsEmails,
            subject: validatedFields.data.title,
            replyTo: `${sessionClaims.userEmail}`,
            react: HeaderEmail({
                text: validatedFields.data.message,
                title: validatedFields.data.title,
                senderName: `${sessionClaims?.userFullName || 'Your-Landscaper'}`,
                companyName: `${sessionClaims.orgName || sessionClaims?.userFullName || 'Your Landscaper'}`,
            }) as React.ReactElement,
        });

        console.log('Email sent successfully:', response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

