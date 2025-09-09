import { Inbox } from "@novu/nextjs"
import { Bell, Settings } from "lucide-react";
import Image from "next/image";

export default function NotificationInbox({ userNovuId }: { userNovuId: string }) {
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
        icons: {
            bell: () => <Bell size={20} />,
            cogs: () => <Settings size={18} />,
        },
        elements: {
            notificationList: "bg-[url('/lawn2.jpg')] bg-cover bg-center ",
            notification: 'backdrop-blur-md bg-white/70  nt-border nt-border-white/30 rounded-xl shadow-sm my-1 hover:nt-bg-white',//hover:nt-bg-white doe'snt work lol but what it does do is stop the notifications from going clear on hover 
            notificationBody: "nt-text-black text-bold ",
            notificationDot: {
                backgroundColor: '#138b10', // Custom dot color
            },
        }
    }
    return (
        < Inbox
            applicationIdentifier={`${process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER}`}
            subscriber={`${userNovuId}`}
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
                                onClick={() => {
                                    if (notification.primaryAction?.redirect?.url) {
                                        window.open(
                                            notification.primaryAction.redirect.url,
                                            notification.primaryAction.redirect.target || '_blank'
                                        );
                                    }
                                }}
                            >
                                {notification.primaryAction.label}
                            </button>
                        )}
                        {notification.secondaryAction && (
                            <button
                                style={secondaryButtonStyle}
                                onClick={() => {
                                    if (notification.secondaryAction?.redirect?.url) {
                                        window.open(
                                            notification.secondaryAction.redirect.url,
                                            notification.secondaryAction.redirect.target || '_blank'
                                        );
                                    }
                                }}
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
    );
}
