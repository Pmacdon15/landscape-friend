'use client'
import { useState, useEffect, createContext, useContext, useRef, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { useUser } from '@clerk/clerk-react';
import { registerNovuDevice } from '@/lib/actions/novu-action';

interface FCMContextType {
    permissionStatus: NotificationPermission | 'not-supported';
    fcmToken: string | null;
    loading: boolean;
    requestNotificationPermissionAndToken: () => Promise<void>;
}

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const VAPID_KEY = "BPFSqTStA7Mj1cwUo71zL-1oCgTz6ap4DGGRzEzFpHzA_MYIke8WhKiiHnwg0YBut0Yg3ruXouTNfOvWL3apin4";

const FCMContext = createContext<FCMContextType | null>(null);

export default function FCMProvider({ children }: { children: React.ReactNode }) {
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'not-supported' | 'default'>('default');
    const [fcmToken, setFcmToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const messagingInstance = useRef<Messaging | null>(null);
    const { user } = useUser();

    const sendTokenToServer = useCallback(async (token: string, userId: string) => {
        try {
            await registerNovuDevice(token, token)
        } catch (error) {
            console.error('Error sending token to server:', error);
        }
    }, []);

    const requestNotificationPermissionAndToken = useCallback(async () => {
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
                // console.log('Notification permission granted.');
                const currentToken = await getToken(messagingInstance.current, { vapidKey: VAPID_KEY });

                if (currentToken && user?.id) {
                    // console.log('FCM Registration Token:', currentToken);
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
    }, [user?.id, sendTokenToServer]);

    useEffect(() => {
        if (user?.id && permissionStatus !== 'granted' && permissionStatus !== 'not-supported') {
            requestNotificationPermissionAndToken();
        }
    }, [user?.id, permissionStatus, requestNotificationPermissionAndToken]);

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
                if (messagingInstance.current) {
                    getToken(messagingInstance.current, { vapidKey: VAPID_KEY })
                        .then((currentToken) => {
                            if (currentToken && user?.id) {
                                // console.log('FCM Token retrieved on load:', currentToken);
                                setFcmToken(currentToken);
                                sendTokenToServer(currentToken, user.id);
                            }
                            // else {
                            //     console.log('No FCM token available on load, despite granted permission.');
                            // }
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
            // console.log('Conditions not met for SW registration or notifications: window defined:', typeof window !== 'undefined', 'serviceWorker in navigator:', 'serviceWorker' in navigator);
            setLoading(false);
            setPermissionStatus('not-supported');
        }
    }, [user?.id, sendTokenToServer]);

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