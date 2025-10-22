import { Plus } from 'lucide-react'
import FormContainer from '../containers/form-container'
import { EditSettingSheet } from '../sheets/edit-settings-sheet'
import { AddClientForm } from './add-client-form'

export default function AddClientFormContainer() {
	return (
		<FormContainer>
			<div className="w-full flex justify-end">
				<EditSettingSheet
					prompt={'Enter Client Information'}
					title={
						<>
							<Plus /> Add a Client
						</>
					}
				>
					<AddClientForm />
				</EditSettingSheet>
			</div>
		</FormContainer>
	)
}
