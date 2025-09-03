'use client'
import { OrganizationSwitcher, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { NavBar } from '../nav/nav-bar';
import { useGetNovuId } from '@/lib/hooks/useNovu';
import Spinner from '../loaders/spinner';
import NotificationInbox from '../inbox/inbox';
// import { dark } from '@novu/react/themes';

export default function Header({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const { data: novuId, isPending } = useGetNovuId(user?.id);



    return (
        <div className="flex flex-col items-center bg-background border rounded-b-sm p-4 w-full gap-2 ">

            {children}
            <div className='flex flex-wrap justify-between border-t w-full pt-2'>
                {user?.id && <NavBar userId={user.id} />}
                <div className="flex ml-auto items-center gap-2">
                    <SignedIn>
                        <UserButton />
                        <OrganizationSwitcher />
                    </SignedIn>
                </div>
                {isPending && user && <Spinner variant='notification-menu' />}
                {novuId && !isPending &&
                    <NotificationInbox userNovuId={novuId.UserNovuId} />
                }
                <SignedOut>
                    <div className="bg-white/30 backdrop-filter backdrop-blur-md flex gap-4 p-2 rounded-sm ml-auto">
                        <SignInButton />
                        <SignUpButton />
                    </div>
                </SignedOut>
            </div >
        </div>
    );
}