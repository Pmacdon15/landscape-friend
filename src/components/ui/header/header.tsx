import { OrganizationSwitcher, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import HeaderTitle from './header-title';
import HeaderImageIco from './header-image-ico';
import Link from 'next/link';
import { NavBar } from '../nav/nav-bar';
import { isOrgAdmin } from "@/lib/clerk";
import { Inbox } from '@novu/nextjs';
import { fetchNovuId } from '@/DAL/dal-user';

export default async function Header({ hasStripAPIKeyPromise }: { hasStripAPIKeyPromise: Promise<boolean> }) {
    const { isAdmin, userId } = await isOrgAdmin(false)
    let novuId
    if (userId) novuId = await fetchNovuId(userId)
    // console.log("Novu Id: ", novuId)

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
                        <Link href='/'>
                            <HeaderTitle text='Landscape Friend' />
                        </Link>
                    </div>
                </div>
                <div className='flex flex-wrap justify-between border-t w-full pt-2'>
                    {userId ?
                        <>
                            <NavBar hasStripAPIKeyPromise={hasStripAPIKeyPromise} userId={userId} isAdmin={isAdmin} />
                            <div className="flex ml-auto items-center gap-2">
                                <SignedIn>
                                    <UserButton />
                                    <OrganizationSwitcher />
                                </SignedIn>
                            </div>
                            {novuId &&
                                <Inbox
                                    applicationIdentifier={`${process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER}`}
                                    subscriber={`${novuId.UserNovuId}`}
                                />
                            }
                        </>
                        :
                        <div className="bg-white/30 backdrop-filter backdrop-blur-md flex gap-4 p-2 rounded-sm ml-auto">
                            <SignedOut>
                                <SignInButton />
                                <SignUpButton />
                            </SignedOut>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}

