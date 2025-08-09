import { OrganizationSwitcher, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import HeaderTitle from './header-title';
import HeaderImageIco from './header-image-ico';
import Link from 'next/link';
import { NavBar } from '../nav/nav-bar';
import { Suspense } from 'react';
import ClientOnly from '../../wrappers/ClientOnly';

export default function Header() {
    return (
        <>
            <div className="flex flex-col items-center bg-background border rounded-b-sm p-4 w-full gap-2 ">
                <div className='flex  w-full justify-baseline relative'>
                    <div className="flex flex-col items-center justify-center h-full">
                        <Link href='/'>
                            <HeaderImageIco />
                        </Link>
                    </div>
                    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-fit'>
                        <HeaderTitle text='Lawn Buddy' />
                    </div>
                </div>
                <div className='flex flex-wrap justify-between border-t w-full pt-2'>
                    <Suspense>
                        <SignedIn>
                            <NavBar />
                            <div className="flex ml-auto items-center gap-2">
                                <ClientOnly>
                                  <UserButton />
                                  <OrganizationSwitcher />
                                </ClientOnly>
                            </div>
                        </SignedIn>
                        <SignedOut>
                            <div className="bg-white/30 backdrop-filter backdrop-blur-md flex gap-4 p-2 rounded-sm ml-auto">
                                <SignInButton />
                                <SignUpButton />
                            </div>
                        </SignedOut>
                    </Suspense>
                </div>
            </div>
        </>
    );
}