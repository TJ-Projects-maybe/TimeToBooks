"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { FullPageLoadingSpinner } from "../components/LoadingSpinner"

export const dynamic = "force-dynamic"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Always redirect to /login on the home page
    // Auth will be handled by the login page
    router.push("/login")
  }, [router])

  return (
    <FullPageLoadingSpinner message="Redirection en cours..." />
  )
}
