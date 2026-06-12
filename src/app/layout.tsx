import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport = {
  themeColor: '#10b981',
};

export const metadata: Metadata = {
  title: 'EcoAura — Know Your Carbon Footprint',
  description: 'Discover your EcoAura through an AI-powered quiz. Track, understand, and reduce your annual carbon footprint with personalized insights and micro-actions.',
  keywords: ['carbon footprint', 'ecoaura', 'sustainability', 'carbon calculator', 'climate action', 'AI', 'gemini'],
  authors: [{ name: 'EcoAura Team' }],
  manifest: '/manifest.json',
  openGraph: {
    title: 'EcoAura — Know Your Carbon Footprint',
    description: 'Discover your AI-generated carbon identity and pledge to reduce your impact. Built with Gemini 2.5 Flash.',
    type: 'website',
    siteName: 'EcoAura',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoAura — Know Your Carbon Footprint',
    description: 'Discover your AI-generated carbon identity and pledge to reduce your impact.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
