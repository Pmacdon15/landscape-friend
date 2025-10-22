'use client'
import { Edit, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../button'
import UpdateStripeApiKeyButton from '../buttons/update-stripe-api-key-button'
import SettingsForm from '../forms/settings-form'
import { InputField } from '../inputs/input'
import { EditSettingSheet } from '../sheets/edit-settings-sheet'
import SettingsDisplayItem from './settings-display-item'

export default function DisplayStripeApiKey({ apiKey }: { apiKey: string }) {
	const [showKey, setShowKey] = useState(false)

	const toggleShowKey = () => {
		setShowKey(!showKey)
	}

	return (
		<SettingsDisplayItem
			actions={
				<div className="flex gap-2">
					{apiKey && (
						<Button onClick={toggleShowKey}>
							{showKey ? (
								<>
									<EyeOff className="w-4 h-4" /> Show
								</>
							) : (
								<>
									<Eye className="w-4 h-4" />
									Hide
								</>
							)}
						</Button>
					)}
					<EditSettingSheet
						prompt={'Edit Stripe API Key'}
						title={
							<>
								<Edit />
								Edit Setting
							</>
						}
					>
						<SettingsForm>
							<InputField
								defaultValue={apiKey}
								name={'api_key'}
								placeholder={'Your Stripe API Key'}
								type={'textarea'}
							/>
							<UpdateStripeApiKeyButton />
						</SettingsForm>
					</EditSettingSheet>
				</div>
			}
			label="Stripe API Key"
		>
			<p className="break-all">
				{showKey
					? apiKey
					: apiKey
						? '********************************'
						: ''}
			</p>
		</SettingsDisplayItem>
	)
}
