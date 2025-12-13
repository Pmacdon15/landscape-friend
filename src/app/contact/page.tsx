import NarrowFormContainer from '@/components/ui/containers/narrow-form-container'
import { ReachOutForm } from '@/components/ui/forms/forms-reach-out/reach-out-form'
import BackToLink from '@/components/ui/links/back-to-link'

export default function Page() {
	return (
		<NarrowFormContainer>
			<ReachOutForm />
			<div className="mx-auto">
				<BackToLink path={'/'} place={'Home'} />
			</div>
		</NarrowFormContainer>
	)
}
