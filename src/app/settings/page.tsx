import { Suspense } from 'react'
import ContentContainer from '@/components/ui/containers/content-container'
import { SettingsLabel } from '@/components/ui/settings/settings-label'
import DisplayStripeApiKey from '@/components/ui/settings/stripe-display-api-key'
import { fetchStripeAPIKey } from '@/lib/dal/stripe-dal'

export default function Settings() {
	const apiKeyPromise = fetchStripeAPIKey()
	return (
		<ContentContainer>
			<SettingsLabel text={'Settings'} />
			<Suspense fallback={<DisplayStripeApiKey />}>
				<DisplayStripeApiKey apiKeyPromise={apiKeyPromise} />
			</Suspense>
		</ContentContainer>
	)
}
;``
