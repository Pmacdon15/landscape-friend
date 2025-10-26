import { Suspense } from 'react'
import FormContainer from '@/components/ui/containers/form-container'
import SearchFormFallBack from '@/components/ui/fallbacks/search/search-form-fallback'
import FormHeader from '@/components/ui/header/form-header'
import { CardView } from '@/components/ui/manage/subscription/manage-subscription-card-view'
import SearchForm from '@/components/ui/search/search-form'

export default function Page(
	props: PageProps<'/billing/manage/subscriptions'>,
) {
	return (
		<FormContainer>
			<FormHeader text={'Manage Subscriptions'} />
			<Suspense fallback={<SearchFormFallBack variant="subscriptions" />}>
				<SearchForm variant="subscriptions" />
			</Suspense>
			{/* //MARK: TODO: add fallback */}
			<Suspense>
				<CardView props={props} />
			</Suspense>
		</FormContainer>
	)
}
