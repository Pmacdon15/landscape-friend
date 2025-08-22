'use client'
import { useEffect } from 'react';

export default function FCMProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        console.log('FCMProvider useEffect triggered.');
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('/firebase-messaging-sw.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        } else {
            console.log('Conditions not met for SW registration: window defined:', typeof window !== 'undefined', 'serviceWorker in navigator:', 'serviceWorker' in navigator);
        }
    }, []);

    return (
        <>{children}</>
    );
}
