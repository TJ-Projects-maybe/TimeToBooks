"use client"

import { useRouter } from "next/navigation"
import { FullPageLoadingSpinner } from "../components/LoadingSpinner"

export const dynamic = "force-dynamic"

export default function Home() {
  const router = useRouter()
  if (typeof window !== "undefined") {
    router.push("/login")
  }
  return <FullPageLoadingSpinner message="Redirection vers la page de connexion..." />
}
