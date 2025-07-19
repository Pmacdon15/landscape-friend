import { OrganizationSwitcher, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image'

export default function Header() {
    return (
        <>
            <div className="flex flex-col items-center bg-background border p-4">
                <div className="flex justify-between items-center w-full">
                    <div className='flex items-center'>
                        <div
                            style={{
                                backgroundImage: 'url(/lawn3.jpg)',
                                backgroundPosition: '0% 50%', // Show the bottom half of the image
                            }}
                            className="p-2 border rounded-sm bg-background w-[50px] md:w-[100px]"
                        >
                            <Image src='/lawn-mower.png' height={100} width={100} alt={"logo"} />
                        </div>
                    </div>
                    <div className="text-2xl md:text-4xl p-2 md:p-6">
                        <span>Lawn Buddy</span>
                    </div>
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