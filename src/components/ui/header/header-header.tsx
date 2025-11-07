import Link from 'next/link'
import HeaderImageIco from './header-image-ico'
import HeaderTitle from './header-title'

export default function HeaderHeader() {
	return (
		<div className="justify-baseline relative flex w-full">
			<div className="flex h-full flex-col items-center justify-center">
				<Link href="/">
					<HeaderImageIco />
				</Link>
			</div>
			<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-fit">
				<Link href="/">
					<HeaderTitle text="Landscape Friend" />
				</Link>
			</div>
		</div>
	)
}
