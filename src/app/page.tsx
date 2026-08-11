"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { FullPageLoadingSpinner } from "../components/LoadingSpinner"

export const dynamic = "force-dynamic"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirection directe vers /login sans vérifier l'auth
    // L'auth sera gérée par les pages individuelles
    router.push("/login")
  }, [router])

  return (
    <FullPageLoadingSpinner message="Redirection vers la page de connexion..." />
  )
}
