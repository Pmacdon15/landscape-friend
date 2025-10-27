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
	let apiKey: APIKey | Error
	if (apiKeyPromise) {
		apiKey = use(apiKeyPromise)
	} else apiKey = new Error("")

	const [showKey, setShowKey] = useState(false)

	const toggleShowKey = () => {
		setShowKey(!showKey)
	}

	return (
		<SettingsDisplayItem
			actions={
				<div className="flex gap-2">
					{apiKeyPromise && !(apiKey instanceof Error) && (
						<Button onClick={toggleShowKey}>
							{showKey ? (
								<>
									<EyeOff className="w-4 h-4" /> Hide
								</>
							) : (
								<>
									<Eye className="w-4 h-4" />
									Show
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
								defaultValue={apiKeyPromise && !(apiKey instanceof Error) ? apiKey.apk_key : ''}
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
				{apiKeyPromise
					? !(apiKey instanceof Error)
						? showKey
							? apiKey.apk_key
							: '********************************'
						: 'API key not set'
					: ''}
			</p>
		</SettingsDisplayItem>
	)
}