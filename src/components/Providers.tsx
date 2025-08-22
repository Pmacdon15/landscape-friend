// In Next.js, this file would be called: app/providers.tsx
'use client'

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import { useUser } from '@clerk/nextjs';
import { useRegisterNovuDevice } from '@/lib/hooks/useRegisterNovuDevice'; // Import the new hook

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()
  const { user } = useUser();
  const subscriberId = user?.id || '';
  const { registerDevice } = useRegisterNovuDevice(); // Use the new hook

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && subscriberId) {
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY }).then(async (currentToken) => {
        if (currentToken) {
          console.log('FCM Token:', currentToken);
          // Send this currentToken and subscriberId to the backend using the hook
          await registerDevice(currentToken, subscriberId);
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      }).catch((err) => {
        console.error('An error occurred while retrieving token. ', err);
      });
    }
  }, [subscriberId, registerDevice]); // Add registerDevice to dependencies

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}