import BackToDocsLink from '@/components/ui/links/back-to-docs-link'
import BackToLink from '@/components/ui/links/back-to-link'
import PlansComponent from '@/components/ui/plans-component'

export default async function Page() {
	return (
		<>
			<PlansComponent />
			<BackToDocsLink />
			<BackToLink path={'/'} place={'Home'} />
		</>
	)
}
