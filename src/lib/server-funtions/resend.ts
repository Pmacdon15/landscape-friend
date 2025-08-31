import { Resend } from "resend";
import HeaderEmail from '@/components/ui/emails/header-email';
import { schemaSendEmail } from "../zod/schemas";
import z from "zod";
import type React from 'react';
import { addResendIdToDb } from "../DB/db-user";

export function formatSenderEmailAddress(sessionClaims: { orgName?: string; userFullName?: string; userEmail?: string }): string {
  const name = (sessionClaims.orgName || sessionClaims.userFullName || 'Your Landscaper').replace(/\s+/g, '-');
  return `${name}@notifications.landscapefriend.com`;
}

export function formatCompanyName(sessionClaims: { orgName?: string; userFullName?: string; userEmail?: string }): string {
  return sessionClaims.orgName || sessionClaims.userFullName || 'Your Landscaper';
}

export async function sendEmail(
  clientsEmail: string,
  companyName: string,
  data: z.infer<typeof schemaSendEmail>,
  attachments?: { filename: string; content: Buffer | string; }[]
): Promise<boolean> {
  const resend = new Resend(process.env.RESEND_API_KEY as string);

  try {
    if (data.sender) {
      await resend.emails.send({
        from: data.sender,
        to: [clientsEmail],
        subject: data.title,
        replyTo: data.replyTo,
        react: HeaderEmail({
          text: data.message,
          title: data.title,
          senderName: data.senderName || 'Your Landscaper',
          companyName: companyName || 'Your Landscaper',
        }) as React.ReactElement,
        attachments: attachments,
      });
      // console.log('Email sent successfully:', response);
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendGroupEmail(
  companyName: string,
  clientsEmails: string[],
  data: z.infer<typeof schemaSendEmail>
): Promise<boolean> {
  const resend = new Resend(process.env.RESEND_API_KEY as string);

  try {
    await resend.emails.send({
      from: `${companyName}@landscapefriend.com`,
      to: clientsEmails,
      subject: data.title || 'News Letter',
      replyTo: data.sender,
      react: HeaderEmail({
        text: data.message,
        title: data.title,
        senderName: data.senderName || 'Your Landscaper',
        companyName: companyName || 'Your Landscaper',
      }) as React.ReactElement,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}


export async function createAduince(orgId: string, orgName: string) {
  const resend = new Resend(process.env.RESEND_API_KEY as string);
  const result = await resend.audiences.create({ name: orgName });
  if (result.data) {
    addResendIdToDb(orgId, String(result.data?.id))
  }
}

export async function addClientToAduince(email: string, firstName: string, lastName: string, orgId: string) {
  const resend = new Resend(process.env.RESEND_API_KEY as string);
  const result = await resend.contacts.create({
    email: email,
    firstName: firstName,
    lastName: lastName,
    unsubscribed: false,
    audienceId: orgId,
  });
  return result
}