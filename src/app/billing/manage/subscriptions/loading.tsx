import FormContainer from '@/components/ui/containers/form-container'
import SearchFormFallBack from '@/components/ui/fallbacks/search/search-form-fallback'
import FormHeader from '@/components/ui/header/form-header'

export default function Loading() {
	return (
		<FormContainer>
			<FormHeader text={'Manage Subscriptions'} />
			<SearchFormFallBack variant="subscriptions" />
		</FormContainer>
	)
}
