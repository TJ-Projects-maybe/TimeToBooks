"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../lib/hooks/useAuth"
import { FullPageLoadingSpinner } from "../components/LoadingSpinner"

export const dynamic = "force-dynamic"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [timeoutReached, setTimeoutReached] = useState(false)

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timer = setTimeout(() => {
      setTimeoutReached(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loading || timeoutReached) {
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }
  }, [user, loading, router, timeoutReached])

  return (
    <FullPageLoadingSpinner message="Redirection en cours..." />
  )
}
