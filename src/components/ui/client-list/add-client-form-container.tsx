'use client'

import { Plus } from 'lucide-react'
import { use, useState } from 'react'
import FormContainer from '../containers/form-container'
import { EditSettingSheet } from '../sheets/edit-settings-sheet'
import { AddClientForm } from './add-client-form'

export default function AddClientFormContainer() {
	// const isAdmin = use(isAdminPromise || Promise.resolve({ isAdmin: false }))

	const [open, setOpen] = useState(false)

	// if (!isAdmin.isAdmin) return null
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
