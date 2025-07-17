import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image'

export default function Header() {
    return (
        <div className="flex flex-col justify-start items-center bg-mainColor border p-4 relative">
            <div className="flex justify-start items-center w-full">
                <div
                    style={{
                        backgroundImage: 'url(/lawn3.jpg)',
                        backgroundPosition: '0% 50%', // Show the bottom half of the image
                    }}
                    className="p-2 border rounded-sm bg-background w-[50px] md:w-[100px]"
                >
                    <Image src='/lawn-mower.png' height={100} width={100} alt={"logo"} />
                </div>
                <div className="text-2xl md:text-4xl p-2 md:p-6 md:px-16 bg-background/30 rounded-sm absolute left-1/2 transform -translate-x-1/2 shadow-lg">
                    <span>Lawn Buddy</span>
                </div>
            </div>
            <div className="flex gap-4 absolute bottom-4 right-4 border border-borderColor p-2 rounded-sm">
                <SignedOut>
                    <SignInButton />
                    <SignUpButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </div>
    );
}