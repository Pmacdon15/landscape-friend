'use client'
import { use, useState } from 'react'
import type { NamesAndEmails } from '@/types/clients-types'
import SendClientEmailButton from '../buttons/send-client-email-button'
import FormContainer from '../containers/form-container'
import FormHeader from '../header/form-header'

export default function SendIndividualEmail({
	children,
	namesAndEmailsPromise,
}: {
	children: React.ReactNode
	namesAndEmailsPromise: Promise<NamesAndEmails[] | Error>
}) {
	const data = use(namesAndEmailsPromise)
	const [clientEmail, setClientEmail] = useState('')

	const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setClientEmail(e.target.value)
	}

	if (data instanceof Error) {
		return (
			<FormContainer>
				<FormHeader text={`Error`} />
				<p>Error: {data.message}</p>
			</FormContainer>
		)
	}

	return (
		<FormContainer>
			<FormHeader text={`Send an Email to a client`} />
			<form className="flex w-full flex-col gap-4">
				<select
					className="sm rounded border bg-white p-2"
					onChange={handleClientChange}
				>
					<option value={' '}> </option>
					{data.map((client: NamesAndEmails) => (
						<option
							key={client.email_address}
							value={client.email_address}
						>
							{client.full_name} ({client.email_address})
						</option>
					))}
				</select>
				{children}
				<div className="flex w-full justify-center">
					<SendClientEmailButton clientEmail={clientEmail} />
				</div>
			</form>
		</FormContainer>
	)
}
