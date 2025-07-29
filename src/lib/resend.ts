
import { Resend } from "resend";
import HeaderEmail from '@/components/ui/emails/header-email';
import { schemaSendEmail } from "./zod/schemas";
import z from "zod";

interface SessionClaims {
    orgName?: string;
    userFullName?: string;
    userEmail?: string;
}

interface SessionClaims {
  orgName?: string;
  userFullName?: string;
}


export function formatSenderEmailAddress(sessionClaims: SessionClaims) {
    const name = (sessionClaims.orgName as string || sessionClaims?.userFullName as string || 'Your Landscaper').replace(/\s+/g, '-');
    return `${name}@lawn-buddy.patmac.ca`;
}


export function formatCompanyName(sessionClaims: SessionClaims) {
  return sessionClaims.orgName || sessionClaims.userFullName || 'Your Landscaper';
}

export async function sendEmail(
    clientsEmail: string,
    companyName: string,
    data: z.infer<typeof schemaSendEmail>
) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        if (data.sender) {
            const response = await resend.emails.send({
                from: data.sender,
                to: [clientsEmail],
                subject: data.title,
                replyTo: `${data.replyTo}`,
                react: HeaderEmail({
                    text: data.message,
                    title: data.title,
                    senderName: `${data.senderName || 'Your Landscaper'}`,
                    companyName: `${companyName || 'Your Landscaper'}`,
                }) as React.ReactElement,
            });
            console.log('Email sent successfully:', response);
        }


        return true;
    } catch (e) {
        console.error(e, "Error sending email")
        return false;
    }
}

export async function sendGroupEmail(companyName: string, clientsEmails: string[], data: z.infer<typeof schemaSendEmail>) {

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        resend.emails.send({
            from: `${companyName}@lawn-buddy.patmac.ca`,
            to: clientsEmails,
            subject: 'News Letter',
            // html: data.message,
            replyTo: `${data.sender}`,
            react: HeaderEmail({
                    text: data.message,
                    title: data.title,
                    senderName: `${data.senderName || 'Your Landscaper'}`,
                    companyName: `${companyName || 'Your Landscaper'}`,
                }) as React.ReactElement,
            
        });
    } catch (e) {
        console.error(e, "Error sending email")
        return false
    }
    return true
}