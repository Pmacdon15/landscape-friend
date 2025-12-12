import BackToDocsLink from '@/components/ui/links/back-to-docs-link'
import BackToLink from '@/components/ui/links/back-to-link'
import PlansComponent from '@/components/ui/plans-component'

export default async function Page() {
	return (
		<div className="flex flex-col gap-4">
			<PlansComponent />
			<BackToDocsLink />
			<div className="mx-auto">
				<BackToLink path={'/'} place={'Home'} />
			</div>
		</div>
	)
}
