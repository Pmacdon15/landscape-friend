import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/ui/header/header";
import { ClerkProvider } from '@clerk/nextjs'
import PageContainer from "../components/ui/containers/page-container";
import Providers from "../components/Providers";
import { Suspense } from "react";
import HeaderFallBack from "@/components/ui/fallbacks/header-fallback";
import Footer from "@/components/ui/footer/footer";
import { Toaster } from '@/components/ui/sonner';
import { hasStripAPIKey } from "@/DAL/dal-stripe";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAD_HJcKzLkrYtiBfUFt3a4xICRS3n1Wm0",
  authDomain: "landscape-friend.firebaseapp.com",
  projectId: "landscape-friend",
  storageBucket: "landscape-friend.firebasestorage.app",
  messagingSenderId: "373141664807",
  appId: "1:373141664807:web:31bd61502ffd0447c98a02",
  measurementId: "G-81G4YHH25C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// export const experimental_ppr = true;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Landscape Friend",
  description: "Track and Invoice your lawn clients easily",
  keywords: 'lawn care, lawn tracking, invoice lawn clients, lawn management',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasStripAPIKeyPromise = hasStripAPIKey()  
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body
            style={{
              backgroundImage: 'url(/lawn3.jpg)',
              backgroundSize: 'cover',
              backgroundAttachment: 'fixed',
              backgroundRepeat: 'no-repeat',
            }}
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Suspense fallback={<HeaderFallBack />}>
              <Header hasStripAPIKeyPromise={hasStripAPIKeyPromise} />
            </Suspense>
            <PageContainer>
              {children}
            </PageContainer>
            <Footer />
            <Toaster />
          </body>
        </html >
      </Providers>
    </ClerkProvider>
  );
}
