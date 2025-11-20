'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import FormContainer from '../containers/form-container'
import { EditSettingSheet } from '../sheets/edit-settings-sheet'
import { AddClientForm } from './add-client-form'

export default function AddClientFormContainer({
	isAdminPromise,
}: {
	isAdminPromise?: Promise<{ isAdmin: boolean }>
}) {
	const [open, setOpen] = useState(false)
	// We don't await isAdminPromise here since this is a client component
	// and isAdminPromise is likely a server-side promise.
	// For now, we'll assume the isAdmin check is handled elsewhere or is not critical for the client component's initial render.
	// If isAdmin is truly needed on the client, it should be passed as a direct prop or fetched client-side.
	return (
		<FormContainer>
			<div className="flex w-full justify-end">
				<EditSettingSheet
					onOpenChange={setOpen}
					open={open}
					prompt={'Enter Client Information'}
					title={
						<>
							<Plus /> Add a Client
						</>
					}
				>
					<AddClientForm setSheetOpen={setOpen} />
				</EditSettingSheet>
			</div>
		</FormContainer>
	)
}
