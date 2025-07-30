import { OrganizationSwitcher, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import HeaderTitle from './header-title';
import HeaderImageIco from './header-image-ico';

export default function Header() {
    return (
        <>
            <div className="flex flex-col items-center bg-background border rounded-b-sm p-4 w-full gap-2 ">
                <div className='flex  w-full justify-baseline relative'>
                    <div className="flex flex-col items-center justify-center h-full">
                        <HeaderImageIco />
                    </div>
                    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-fit'>
                        <HeaderTitle text='Lawn Buddy' />
                    </div>
                </div>
                <div className='flex justify-end border-t w-full pt-2'>
                    <SignedIn>
                        <div className="flex items-center gap-2">
                            <UserButton />
                            <OrganizationSwitcher />
                        </div>
                    </SignedIn>
                    <SignedOut>
                        <div className="bg-white/30 backdrop-filter backdrop-blur-md flex gap-4 p-2 rounded-sm">
                            <SignInButton />
                            <SignUpButton />
                        </div>
                    </SignedOut>
                </div>
            </div>
        </>
    );
}