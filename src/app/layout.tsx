import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import FCMProvider from '@/components/providers/fcm-provider'
import QueryProviders from '@/components/providers/query-providers'
import Footer from '@/components/ui/footer/footer'
import HeaderHeader from '@/components/ui/header/header-header'
import { Toaster } from '@/components/ui/sonner'
import PageContainer from '../components/ui/containers/page-container'
import Header from '../components/ui/header/header'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Landscape Friend',
	description: 'Track and Invoice your lawn clients easily',
	keywords: 'lawn care, lawn tracking, invoice lawn clients, lawn management',
}
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`
					${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-[url('/lawn4.png')] bg-cover bg-fixed bg-no-repeat antialiased`}
			>
				<ClerkProvider>
					<QueryProviders>
						<FCMProvider>
							<div className="flex flex-1 flex-col">
								<Header>
									<HeaderHeader />
								</Header>
								<main className="flex-1">
									<PageContainer>
										{children}
										<Analytics />
									</PageContainer>
								</main>
								<Footer />
							</div>
							<Toaster />
						</FCMProvider>
					</QueryProviders>
				</ClerkProvider>
			</body>
		</html>
	)
}
