import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "../components/ToastProvider"
import { SkipLink } from "../components/SkipLink"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TimeToBooks - Suivi de temps d'écriture",
  description: "Suivez votre progression d'écriture et atteignez vos objectifs de mots",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SkipLink />
        <ToastProvider />
        {children}
      </body>
    </html>
  )
}
