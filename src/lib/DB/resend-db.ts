import type { JwtPayload } from '@clerk/types'
import { neon } from '@neondatabase/serverless'
import type z from 'zod'
import type { Email, NamesAndEmails } from '@/types/clients-types'
import { sendGroupEmail } from '../utils/resend'
import type { schemaSendEmail } from '../zod/schemas'

//MARK: Send newsletter
export async function sendNewsLetterDb(
	data: z.infer<typeof schemaSendEmail>,
	sessionClaims: JwtPayload,
	userId: string,
): Promise<boolean> {
	const sql = neon(String(process.env.DATABASE_URL))
	const baseName = String(
		sessionClaims.orgName ||
			sessionClaims.userFullName ||
			'Your-LandScaper',
	)
	const companyName = baseName.replace(/\s+/g, '-')

	const emails = (await sql`
        SELECT email_address FROM clients WHERE organization_id = ${sessionClaims.orgId || userId}
    `) as Email[]

	const emailList = emails.map((email) => email.email_address)

	try {
		sendGroupEmail(companyName, emailList, data)
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

//MARK: Fetch names and emails
export async function fetchClientNamesAndEmailsDb(orgId: string) {
	const sql = neon(String(process.env.DATABASE_URL))
	const namesAndEmails = (await sql`
    SELECT 
      full_name,
      email_address
    FROM clients 
    WHERE organization_id = ${orgId}
  `) as NamesAndEmails[]
	return namesAndEmails
}
