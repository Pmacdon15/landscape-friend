import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lawn Buddy',
  description: 'Track and Invoice your lawn clients easily',
  keywords: 'lawn care, lawn tracking, invoice lawn clients, lawn management, send email to client, client email, contact client, reach out',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}