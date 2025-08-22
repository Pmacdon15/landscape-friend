'use client'
import { useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { useUser } from '@clerk/nextjs';
import { useRegisterNovuDevice } from '@/lib/hooks/useRegisterNovuDevice';

export default function FCMProvider({ children }: { children: React.ReactNode }) {
    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };

    const { user } = useUser();

    const { registerDevice } = useRegisterNovuDevice();

    useEffect(() => {
        console.log('FCMProvider useEffect triggered.');
        if (typeof window !== 'undefined' && 'Notification' in window && user?.id) {
            console.log('Browser environment, Notification API available, and user ID exists.');
            const app = initializeApp(firebaseConfig);
            const messaging = getMessaging(app);
            console.log('Firebase app and messaging initialized.');

            getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY }).then(async (currentToken) => {
                if (currentToken) {
                    console.log('FCM Token obtained:', currentToken);
                    console.log('Attempting to register device with Novu...');
                    await registerDevice(currentToken, user?.id);
                    console.log('Device registration attempt completed.');
                } else {
                    console.log('No registration token available. Request permission to generate one.');
                }
            }).catch((err) => {
                console.error('An error occurred while retrieving token. ', err);
            });
        } else {
            console.log('Conditions not met for FCM setup: window defined:', typeof window !== 'undefined', 'Notification in window:', 'Notification' in window, 'user ID:', user?.id);
        }
    }, [user?.id, registerDevice]); // Added registerDevice to dependencies

    return (
        <>{children}</>
    );
}