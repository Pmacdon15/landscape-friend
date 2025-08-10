import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Landscape Friend',
  description: 'Track and Invoice your lawn clients easily',
  keywords: 'lawn care, lawn tracking, invoice lawn clients, lawn management, send quote, manage invoices, manage quotes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>{children}</>
  );
}