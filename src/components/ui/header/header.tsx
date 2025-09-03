'use client'
import { OrganizationSwitcher, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { NavBar } from '../nav/nav-bar';
import { useGetNovuId } from '@/lib/hooks/useNovu';
import { Inbox } from '@novu/nextjs';
import Spinner from '../loaders/spinner';
import Image from 'next/image';
// import { dark } from '@novu/react/themes';

export default function Header({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const { data: novuId, isPending } = useGetNovuId(user?.id);


    const primaryButtonStyle = {
        border: 'none',
        padding: '5px 10px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        background: '#138b10',
        color: 'white',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    };

    const secondaryButtonStyle = {
        border: '1px solid #E0E0E0',
        padding: '5px 10px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        background: '#fff',       
    };

    const appearance = {
        elements: {
            notificationList: "bg-[url('/lawn2.jpg')] bg-cover bg-center ",
            notification: 'backdrop-blur-md bg-white/70  nt-border nt-border-white/30 rounded-xl shadow-sm my-1 hover:nt-bg-white',
            notificationBody: "nt-text-black text-bold ",
        }
    }

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
                    <Inbox
                        applicationIdentifier={`${process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER}`}
                        subscriber={`${novuId.UserNovuId}`}
                        renderSubject={(notification) => (
                            <>
                                <strong>{(notification.subject ?? 'No Subject')}</strong>
                            </>
                        )}
                        renderCustomActions={(notification) => {
                            return (
                                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                    {notification.primaryAction && (
                                        <button
                                            style={primaryButtonStyle}
                                        >
                                            {notification.primaryAction.label}
                                        </button>
                                    )}
                                    {notification.secondaryAction && (
                                        <button
                                            style={secondaryButtonStyle}
                                        >
                                            {notification.secondaryAction.label}
                                        </button>
                                    )}
                                </div>
                            );
                        }}



                        renderAvatar={() => (
                            <div className='w-8 h-8 rounded-full bg-[#138b10] flex items-center justify-center text-sm font-bold'>
                                <Image src={'/logo.png'} alt={'Logo'} width={100} height={100} />
                            </div>
                        )}
                        appearance={appearance}
                    />
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