'use server'
import { schemaSendNewsLetter } from '@/lib/zod/schemas';
import { Email } from '@/types/types';
import { Resend } from 'resend';
import z from 'zod';

export async function sendEmail(companyName: string, clientsEmails: Email[], data: z.infer<typeof schemaSendNewsLetter>) {

    const resend = new Resend(process.env.RESEND_API);

    try {
        // const emailAddresses = clientsEmails.map(client => client.email_address);

        resend.emails.send({
            from: `${companyName}@lawn-buddy.patmac.ca`,
            to: "pmacdonald15@gmail.com",
            subject: data.title,
            html: data.message
        });
    } catch (e) {
        console.error(e, "Error sending email")
        return false
    }
    return true
}