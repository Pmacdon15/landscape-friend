import FormContainer from '@/components/ui/containers/form-container'
import FormHeader from '@/components/ui/header/form-header'
import type { SearchFormVariant } from '@/types/search-fallback-types'
import EllipsisSpinner from '../loaders/EllipsisSpinner'
import SearchFormFallback from './search/search-form-fallback'

export default function BillingManageFallback({
	variant = 'default',
}: {
	variant?: SearchFormVariant
}) {
	return (
		<FormContainer>
			<FormHeader
				text={`Manage ${variant.charAt(0).toUpperCase() + variant.slice(1)}`}
			/>
			<SearchFormFallback variant={variant} />
			<FormHeader>
				<div className="flex">
					Loading
					<EllipsisSpinner />
				</div>
			</FormHeader>
		</FormContainer>
	)
}
