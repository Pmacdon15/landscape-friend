'use client'

import { Plus } from 'lucide-react'
import { use, useState } from 'react'
import FormContainer from '../containers/form-container'
import { EditSettingSheet } from '../sheets/edit-settings-sheet'
import { EditClientForm } from './edit-client-form'
import { Client } from '@/types/clients-types'

export default function EditClientFormContainer({
	client,
	isAdminPromise,
}: {
	client: Client
	isAdminPromise?: Promise<{ isAdmin: boolean }>
}) {
	const isAdmin = use(isAdminPromise || Promise.resolve({ isAdmin: false }))

	const [open, setOpen] = useState(false)

	if (!isAdmin.isAdmin) return null
	return (
		<FormContainer>
			<div className="flex w-full justify-end">
				<EditSettingSheet
					onOpenChange={setOpen}
					open={open}
					prompt={'Enter Client Information'}
					title={
						<>
							<Plus /> Edit a Client
						</>
					}
				>
					<EditClientForm setSheetOpen={setOpen} />
				</EditSettingSheet>
			</div>
		</FormContainer>
	)
}
