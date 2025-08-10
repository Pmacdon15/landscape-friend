import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/ui/header/header";
import { ClerkProvider } from '@clerk/nextjs'
import PageContainer from "../components/ui/containers/page-container";
import Providers from "../components/Providers";
import { Suspense } from "react";
import HeaderFallBack from "@/components/ui/fallbacks/header-fallback";
import { isOrgAdmin } from "@/lib/webhooks";
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
  const { isAdmin } = await isOrgAdmin()
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
              <Header isAdmin={isAdmin} />
            </Suspense>
            <PageContainer>
              {children}
            </PageContainer>
          </body>
        </html >
      </Providers>
    </ClerkProvider>
  );
}
