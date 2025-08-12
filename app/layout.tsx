import type React from 'react';
import type { Metadata } from 'next';
import { Space_Grotesk, DM_Sans } from 'next/font/google';
import { AuthProvider } from '@/contexts/auth-context';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'NMDPRA Oil Facilities Mapping System',
  description:
    'Professional GIS application for oil facilities and pipeline management',
  generator: 'v0.app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <style>{`
html {
  font-family: ${dmSans.style.fontFamily};
  --font-sans: ${dmSans.variable};
  --font-heading: ${spaceGrotesk.variable};
}
        `}</style>
      </head>
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}
      >
        {/* Added AuthProvider wrapper for authentication context */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
