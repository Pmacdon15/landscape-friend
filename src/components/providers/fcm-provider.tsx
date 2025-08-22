'use client'
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { useUser } from '@clerk/clerk-react';

interface FCMContextType {
    permissionStatus: NotificationPermission | 'not-supported';
    fcmToken: string | null;
    loading: boolean;
    requestNotificationPermissionAndToken: () => Promise<void>;
}

const firebaseConfig = {
    apiKey: "AIzaSyAD_HJcKzLkrYtiBfUFt3a4xICRS3n1Wm0",
    authDomain: "landscape-friend.firebaseapp.com",
    projectId: "landscape-friend",
    storageBucket: "landscape-friend.firebasestorage.app",
    messagingSenderId: "373141664807",
    appId: "1:373141664807:web:31bd61502ffd0447c98a02",
    measurementId: "G-81G4YHH25C"
};

const VAPID_KEY = "BPFSqTStA7Mj1cwUo71zL-1oCgTz6ap4DGGRzEzFpHzA_MYIke8WhKiiHnwg0YBut0Yg3ruXouTNfOvWL3apin4";

const FCMContext = createContext<FCMContextType | null>(null);

export default function FCMProvider({ children }: { children: React.ReactNode }) {
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'not-supported' | 'default'>('default'); 
    const [fcmToken, setFcmToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const messagingInstance = useRef<Messaging | null>(null); 
    const { user } = useUser();

    const sendTokenToServer = async (token: string, userId: string) => {
        try {
            const response = await fetch('/api/register-device', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token, userId: userId }),
            });

            if (response.ok) {
                console.log('FCM Token successfully sent to API.');
            } else {
                console.error('Failed to send FCM Token to API. Status:', response.status, 'Error:', await response.text());
            }
        } catch (error) {
            console.error('Error sending token to server:', error);
        }
    };

    const requestNotificationPermissionAndToken = async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            console.warn('Notifications not supported in this environment.');
            setPermissionStatus('not-supported');
            return;
        }

        if (!messagingInstance.current) {
            console.error('Firebase Messaging not initialized.');
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            setPermissionStatus(permission);

            if (permission === 'granted') {
                console.log('Notification permission granted.');
                const currentToken = await getToken(messagingInstance.current, { vapidKey: VAPID_KEY });

                if (currentToken && user?.id) {
                    console.log('FCM Registration Token:', currentToken);
                    setFcmToken(currentToken);
                    await sendTokenToServer(currentToken, user.id);
                } else {
                    console.warn('No registration token available. This may happen if the browser is closed or permission is denied.');
                }
            } else {
                console.warn('Notification permission denied or dismissed.');
            }
        } catch (error) {
    if (error instanceof Error) {
        console.error('Error sending token to server:', error.message);
    } else {
        console.error('An unknown error occurred:', error);
    }
    }
};

    useEffect(() => {
        console.log('FCMProvider useEffect triggered.');
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const app = initializeApp(firebaseConfig);
            messagingInstance.current = getMessaging(app); 

            navigator.serviceWorker.register('/firebase-messaging-sw.js')
                .then((registration) => {
                    console.log('Service Worker registered successfully:', registration.scope);
                    if (registration.waiting) {
                        registration.waiting.postMessage('SKIP_WAITING');
                    }
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });

            onMessage(messagingInstance.current, (payload) => {
                console.log('[FCMProvider] Received foreground message:', payload);
                alert(`New Message: ${payload.notification?.title || ''} - ${payload.notification?.body || ''}`);
            });

            const initialPermission = Notification.permission;
            setPermissionStatus(initialPermission);

            if (initialPermission === 'granted') {
                if(messagingInstance.current) {
                    getToken(messagingInstance.current, { vapidKey: VAPID_KEY })
                    .then((currentToken) => {
                        if (currentToken && user?.id) {
                            console.log('FCM Token retrieved on load:', currentToken);
                            setFcmToken(currentToken);
                            sendTokenToServer(currentToken, user.id);
                        } else {
                            console.log('No FCM token available on load, despite granted permission.');
                        }
                    })
                    .catch((err) => {
                        console.error('Error retrieving FCM token on load:', err);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
                } else {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }

        } else {
            console.log('Conditions not met for SW registration or notifications: window defined:', typeof window !== 'undefined', 'serviceWorker in navigator:', 'serviceWorker' in navigator);
            setLoading(false);
            setPermissionStatus('not-supported');
        }
    }, [user?.id]); 

    const contextValue = {
        permissionStatus,
        fcmToken,
        loading,
        requestNotificationPermissionAndToken,
    };

    return (
        <FCMContext.Provider value={contextValue}>
            {children}
        </FCMContext.Provider>
    );
}

export const useFCM = () => {
    const context = useContext(FCMContext);
    if (context === null) {
        throw new Error('useFCM must be used within an FCMProvider');
    }
    return context;
};