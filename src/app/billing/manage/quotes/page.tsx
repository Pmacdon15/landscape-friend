import { Suspense } from 'react'
import FormContainer from '@/components/ui/containers/form-container'
import SearchFormFallBack from '@/components/ui/fallbacks/search/search-form-fallback'
import FormHeader from '@/components/ui/header/form-header'
import { ManageQuoteCardView } from '@/components/ui/manage/quotes/manage-quotes-card-view'
import SearchForm from '@/components/ui/search/search-form'

export default function Page(props: PageProps<'/billing/manage/quotes'>) {
	return (
		<FormContainer>
			<FormHeader text={'Manage Quotes'} />
			<Suspense fallback={<SearchFormFallBack variant="quotes" />}>
				<SearchForm variant="quotes" />
			</Suspense>
			{/* //MARK: TODO: add fallback */}
			<Suspense>
				<ManageQuoteCardView props={props} />
			</Suspense>
		</FormContainer>
	)
}
