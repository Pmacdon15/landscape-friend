'use server'
import { schemaSendNewsLetter } from '@/lib/zod/schemas';

import { Resend } from 'resend';
import z from 'zod';

export async function sendEmail(companyName: string, clientsEmails: string[], data: z.infer<typeof schemaSendNewsLetter>) {

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        resend.emails.send({
            from: `${companyName}@lawn-buddy.patmac.ca`,
            to: clientsEmails,
            subject: data.title,
            html: data.message
        });
    } catch (e) {
        console.error(e, "Error sending email")
        return false
    }
    return true
}