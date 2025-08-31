import { Email, NamesAndEmails } from "@/types/types-clients";
import { neon } from "@neondatabase/serverless";
import { sendGroupEmail } from "../utils/resend";
import { schemaSendEmail } from "../zod/schemas";
import { JwtPayload } from "@clerk/types";
import z from "zod";

//MARK: Send newsletter
export async function sendNewsLetterDb(data: z.infer<typeof schemaSendEmail>, sessionClaims: JwtPayload, userId: string): Promise<boolean> {
  const sql = neon(process.env.DATABASE_URL!);
  const baseName = String(sessionClaims.orgName || sessionClaims.userFullName || "Your-LandScaper");
  const companyName = baseName.replace(/\s+/g, '-');

  const emails = await sql`
        SELECT email_address FROM clients WHERE organization_id = ${sessionClaims.orgId || userId}
    ` as Email[];

  const emailList = emails.map(email => email.email_address);

  try {
    sendGroupEmail(companyName, emailList, data);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

//MARK: Fetch names and emails
export async function fetchClientNamesAndEmailsDb(orgId: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const namesAndEmails = await (sql`
    SELECT 
      full_name,
      email_address
    FROM clients 
    WHERE organization_id = ${orgId}
  `) as NamesAndEmails[]
  return namesAndEmails
}
