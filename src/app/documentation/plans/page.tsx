import BackToLink from '@/components/ui/links/back-to-link'
import PlansComponent from '@/components/ui/plans-component'

export default async function Page() {
	return (
		<>
			<PlansComponent />
			<BackToLink path={'/'} place={'Home'} />
		</>
	)
}
