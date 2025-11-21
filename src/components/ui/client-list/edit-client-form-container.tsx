'use client'

import { Edit } from 'lucide-react'
import { useState } from 'react'
import type { Client } from '@/types/clients-types'
import { EditSettingSheet } from '../sheets/edit-settings-sheet'
import { EditClientForm } from './edit-client-form'

export default function EditClientFormContainer({
	client,
	isAdmin,
}: {
	client: Client
	isAdmin: boolean
}) {
	const [open, setOpen] = useState(false)

	if (!isAdmin) return null
	return (
		<div className="flex w-full justify-center">
			<EditSettingSheet
				onOpenChange={setOpen}
				open={open}
				prompt={'Enter Client Information'}
				title={
					<div className="flex gap-2">
						<Edit size={20}/> Edit a Client
					</div>
				}
				variant="link"
			>
				<EditClientForm client={client} setSheetOpen={setOpen} />
			</EditSettingSheet>
		</div>
	)
}
