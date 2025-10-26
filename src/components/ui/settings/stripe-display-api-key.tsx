'use client'
import { Edit, Eye, EyeOff } from 'lucide-react'
import { use, useState } from 'react'
import type { APIKey } from '@/types/stripe-types'
import { Button } from '../button'
import UpdateStripeApiKeyButton from '../buttons/update-stripe-api-key-button'
import SettingsForm from '../forms/settings-form'
import { InputField } from '../inputs/input'
import { EditSettingSheet } from '../sheets/edit-settings-sheet'
import SettingsDisplayItem from './settings-display-item'

export default function DisplayStripeApiKey({
	apiKeyPromise,
}: {
	apiKeyPromise?: Promise<APIKey | Error>
}) {
	const apiKey = use(apiKeyPromise || Promise.resolve(new Error('Error')))
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
								defaultValue={String(apiKey)}
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
					? String(apiKey)
					: apiKey
						? '********************************'
						: ''}
			</p>
		</SettingsDisplayItem>
	)
}
