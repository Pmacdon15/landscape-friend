'use client'
import {
	OrganizationSwitcher,
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
	useUser,
} from '@clerk/nextjs'
import { useGetNovuId } from '@/lib/hooks/useNovu'
import NotificationInbox from '../inbox/inbox'
import Spinner from '../loaders/spinner'
import { NavBar } from '../nav/nav-bar'
// import { dark } from '@novu/react/themes';

export default function Header({ children }: { children: React.ReactNode }) {
	const { user } = useUser()
	const { data: novuId, isPending } = useGetNovuId(user?.id)

	return (
		<div className="flex w-full flex-col items-center gap-2 rounded-b-sm border bg-background p-4">
			{children}
			<div className="flex w-full flex-wrap justify-between border-t pt-2">
				{user?.id && <NavBar />}
				<div className="ml-auto flex items-center gap-2">
					<SignedIn>
						<UserButton />
						<OrganizationSwitcher />
					</SignedIn>
				</div>
				{isPending && user && <Spinner variant="notification-menu" />}
				{novuId && !isPending && (
					<NotificationInbox userNovuId={novuId.UserNovuId} />
				)}
				<SignedOut>
					<div className="ml-auto flex gap-4 rounded-sm bg-white/30 p-2 backdrop-blur-md backdrop-filter">
						<SignInButton />
						<SignUpButton />
					</div>
				</SignedOut>
			</div>
		</div>
	)
}
