'use client'
import { OrganizationSwitcher, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import HeaderTitle from './header-title';
import HeaderImageIco from './header-image-ico';
import Link from 'next/link';
import { NavBar } from '../nav/nav-bar';
import { useGetNovuId } from '@/lib/hooks/useNovu';
import { Inbox } from '@novu/nextjs';
import Spinner from '../spinner';

export default function Header() {
    const { user, isLoaded } = useUser();
    const { data: novuId, isPending } = useGetNovuId(user?.id);

    return (
        <div className="flex flex-col items-center bg-background border rounded-b-sm p-4 w-full gap-2 ">
            <div className='flex  w-full justify-baseline relative'>
                <div className="flex flex-col items-center justify-center h-full">
                    <Link href='/'>
                        <HeaderImageIco />
                    </Link>
                </div>
                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-fit'>
                    <Link href='/'>
                        <HeaderTitle text='Landscape Friend' />
                    </Link>
                </div>
            </div>
            <div className='flex flex-wrap justify-between border-t w-full pt-2'>

                <>
                    {user?.id && <NavBar userId={user.id} />}
                    <div className="flex ml-auto items-center gap-2">
                        <SignedIn>
                            <UserButton />
                            <OrganizationSwitcher />
                        </SignedIn>
                    </div>
                    {isPending && <Spinner />}
                    {novuId && !isPending &&
                        <Inbox
                            applicationIdentifier={`${process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER}`}
                            subscriber={`${novuId.UserNovuId}`}
                        />
                    }
                </>


                <SignedOut>
                    <div className="bg-white/30 backdrop-filter backdrop-blur-md flex gap-4 p-2 rounded-sm ml-auto">
                        <SignInButton />
                        <SignUpButton />
                    </div>
                </SignedOut>


            </div >
        </div >
    );
}