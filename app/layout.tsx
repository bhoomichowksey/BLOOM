import type { Metadata, Viewport } from 'next'
import { DM_Sans, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _dmSans = DM_Sans({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Bloom - Women's Wellness",
  description:
    "Your personal wellness companion for cycle tracking, mood monitoring, and AI-powered health insights",

  openGraph: {
    title: "Bloom - Women's Wellness",
    description:
      "Your personal wellness companion for cycle tracking, mood monitoring, and AI-powered health insights",
    url: "https://YOUR-VERCEL-URL.vercel.app",
    siteName: "Bloom",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bloom - Women's Wellness",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Bloom - Women's Wellness",
    description:
      "Your personal wellness companion for cycle tracking, mood monitoring, and AI-powered health insights",
    images: ["/og-image.png"],
  },

  generator: "v0.app",

  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#e8a5b5",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
