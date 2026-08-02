"use client"

import { supabase } from './supabaseClient'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useAuth = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    // Simple check for Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Redirect logic
      if (!session && !window.location.pathname.includes('/login')) {
        router.push('/login')
      }
    })

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      
      if (!session && !window.location.pathname.includes('/login')) {
        router.push('/login')
      }
    })

    return () => subscription?.unsubscribe()
  }, [router])

  return { user, loading }
}
