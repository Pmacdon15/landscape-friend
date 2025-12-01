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

type ApiKeyResponse = APIKey | { errorMessage: string }

export default function DisplayStripeApiKey({
	apiKeyPromise,
}: {
	apiKeyPromise?: Promise<ApiKeyResponse>
}) {
	// Safely handle optional promise
	const apiKeyData = apiKeyPromise ? use(apiKeyPromise) : null

	const [showKey, setShowKey] = useState(false)
	const toggleShowKey = () => setShowKey((prev) => !prev)

	// Determine if we have a valid key or an error
	const hasError = apiKeyData && 'errorMessage' in apiKeyData
	const apiKey = hasError ? null : (apiKeyData as APIKey | null)
	const displayedKey =
		showKey && apiKey ? apiKey.apk_key : '••••••••••••••••••••••••••••••••'

	return (
		<SettingsDisplayItem
			actions={
				<div className="flex gap-2">
					{/* Show/Hide button only when we have a real key */}
					{apiKey && (
						<Button
							onClick={toggleShowKey}
							size="sm"
							variant="outline"
						>
							{showKey ? (
								<>
									<EyeOff className="mr-2 h-4 w-4" />
									Hide
								</>
							) : (
								<>
									<Eye className="mr-2 h-4 w-4" />
									Show
								</>
							)}
						</Button>
					)}

					{/* Edit sheet - always available */}
					<EditSettingSheet
						prompt="Edit Stripe API Key"
						title={
							<>
								<Edit className="mr-2 h-4 w-4" />
								Edit Setting
							</>
						}
					>
						<SettingsForm>
							<InputField
								defaultValue={apiKey?.apk_key ?? ''}
								name="api_key"
								placeholder="sk_live_..."
								type="textarea"
							/>
							<UpdateStripeApiKeyButton />
						</SettingsForm>
					</EditSettingSheet>
				</div>
			}
			label="Stripe API Key"
		>
			<p className="break-all font-mono text-sm">
				{apiKeyData === null ? (
					<span className="text-muted-foreground">Loading...</span>
				) : hasError ? (
					<span className="text-destructive">
						{(apiKeyData as { errorMessage: string }).errorMessage}
					</span>
				) : apiKey ? (
					displayedKey
				) : (
					<span className="text-muted-foreground italic">
						No API key set
					</span>
				)}
			</p>
		</SettingsDisplayItem>
	)
}
