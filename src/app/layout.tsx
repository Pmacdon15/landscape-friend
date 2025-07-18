import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../../components/ui/header/header";
import { ClerkProvider } from '@clerk/nextjs'
import PageContainer from "../../components/ui/containers/page-container";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lawn Buddy",
  description: "Track and Invoice your lawn clients easily",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          style={{
            backgroundImage: 'url(/lawn3.jpg)',

          }}
          className={`${geistSans.variable} ${geistMono.variable} antialiased `}
        >
          <Header />
          <PageContainer>
            {children}
          </PageContainer>
        </body>
      </html >
    </ClerkProvider>
  );
}
