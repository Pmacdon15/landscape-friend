import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Landscape Friend',
	description: 'Need Info on how to get set up?',
	keywords:
		'lawn care, lawn tracking, invoice lawn clients, lawn management, documents',
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <>{children}</>
}
