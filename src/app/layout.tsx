import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWAManager from "../components/PWAManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eli's Icebreakers - Fun question game for parties & road trips",
  description: "Break the ice with fun and engaging questions! Perfect for parties, road trips, getting to know people, or awkward silences. Features family-friendly and uncensored modes with hundreds of creative conversation starters.",
  keywords: "icebreaker questions, conversation starters, party games, road trip games, getting to know you questions, fun questions, social games, conversation games, party activities",
  authors: [{ name: "Oliver Kronholm Thomsen" }],
  creator: "Oliver Kronholm Thomsen",
  publisher: "Eli's Icebreakers",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://elis-icebreakers.vercel.app'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Eli's Icebreakers - Fun Question Game",
    description: "Break the ice with fun and engaging questions! Perfect for parties, road trips, and getting to know people better.",
    url: 'https://elis-icebreakers.vercel.app',
    siteName: "Eli's Icebreakers",
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PWAManager />
        {children}
      </body>
    </html>
  );
}
