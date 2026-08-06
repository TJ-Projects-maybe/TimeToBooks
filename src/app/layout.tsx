import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "../components/ToastProvider"
import { SkipLink } from "../components/SkipLink"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TimeToBooks - Suivi de temps d'écriture",
  description: "Suivez votre progression d'écriture et atteignez vos objectifs de mots",
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TimeToBooks",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://time-to-books.vercel.app",
    siteName: "TimeToBooks",
    title: "TimeToBooks - Suivi de temps d'écriture",
    description: "Suivez votre progression d'écriture et atteignez vos objectifs de mots",
  },
  twitter: {
    card: "summary_large_image",
    title: "TimeToBooks - Suivi de temps d'écriture",
    description: "Suivez votre progression d'écriture et atteignez vos objectifs de mots",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Accessibility: Skip to main content */}
        <SkipLink />
        
        {/* Toast notifications */}
        <ToastProvider />
        
        {/* Main content */}
        <main id="main-content">{children}</main>
      </body>
    </html>
  )
}
