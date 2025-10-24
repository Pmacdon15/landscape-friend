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
		<ClerkProvider>
			<QueryProviders>
				<FCMProvider>
					<html lang="en">
						<body
							className={`${geistSans.variable} ${geistMono.variable} antialiased`}
							style={{
								margin: 0,
								padding: 0,
								minHeight: '100vh',
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<div
								style={{
									flex: 1,
									backgroundImage: 'url(/lawn3.jpg)',
									backgroundSize: 'cover',
									backgroundAttachment: 'fixed',
									backgroundRepeat: 'no-repeat',
								}}
							>
								<Header>
									<HeaderHeader />
								</Header>
								<PageContainer>
									{children}
									<Analytics />
								</PageContainer>
							</div>
							<Footer />
							<Toaster />
						</body>
					</html>
				</FCMProvider>
			</QueryProviders>
		</ClerkProvider>
	)
}
