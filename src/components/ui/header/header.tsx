import { OrganizationSwitcher, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image'

export default function Header() {
    return (
        <>
            <div className="flex flex-col justify-start items-center bg-background border p-4">
                <div className="flex justify-start items-center w-full relative">
                    <div
                        style={{
                            backgroundImage: 'url(/lawn3.jpg)',
                            backgroundPosition: '0% 50%', // Show the bottom half of the image
                        }}
                        className="p-2 border rounded-sm bg-background w-[50px] md:w-[100px]"
                    >
                        <Image src='/lawn-mower.png' height={100} width={100} alt={"logo"} />
                    </div>
                    <div className="text-2xl md:text-4xl p-2 md:p-6 md:px-16 bg-white/30 rounded-sm absolute left-1/2 transform -translate-x-1/2 shadow-lg">
                        <span>Lawn Buddy</span>
                    </div>
                    <div className='right-1 absolute'>
                        <SignedIn>
                            <UserButton />
                            <OrganizationSwitcher />
                        </SignedIn>
                    </div>
                </div>
            </div >
            <SignedOut>
                <div className="flex justify-end w-full mt-2 p-2">
                    <div className="bg-white/30 backdrop-filter backdrop-blur-md flex gap-4 p-2 rounded-sm">
                        <SignInButton />
                        <SignUpButton />
                    </div>
                </div >
            </SignedOut>

        </>
    );
}