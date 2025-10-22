import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Landscape Friend',
	description: 'Track and Invoice your lawn clients easily',
	keywords:
		'lawn care, lawn tracking, invoice lawn clients, lawn management, client lists, snow clearing lists',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <>{children}</>
}
