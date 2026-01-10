'use client'

import { Edit } from 'lucide-react'
import { use, useState } from 'react'
import type { Client, ClientAddress } from '@/types/clients-types'
import { EditSettingSheet } from '../sheets/edit-settings-sheet'
import { EditClientForm } from './edit-client-form'

export default function EditClientFormContainer({
	client,
	addresses,
	pagePromise,
}: {
	client: Client
	addresses: ClientAddress[]

	pagePromise: Promise<number>
}) {
	const page = use(pagePromise)
	const [open, setOpen] = useState(false)

	return (
		<div className="flex w-full justify-center">
			<EditSettingSheet
				onOpenChange={setOpen}
				open={open}
				prompt={'Enter Client Information'}
				title={
					<div className="flex gap-2">
						<Edit size={20} /> Edit a Client
					</div>
				}
				variant="link"
			>
				<EditClientForm
					addresses={addresses}
					client={client}
					page={page}
					setSheetOpen={setOpen}
				/>
			</EditSettingSheet>
		</div>
	)
}
