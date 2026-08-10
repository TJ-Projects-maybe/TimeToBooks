"use client"

import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { User } from "../types"
import { isClient } from "../utils/clientOnly"

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only run on client-side
    if (!isClient) {
      setLoading(false)
      return
    }

    // Check current session with timeout
    const checkSession = async () => {
      try {
        // Set a timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 5000)
        )
        
        const sessionPromise = supabase.auth.getSession()
        
        const { data: { session } } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ])
        
        setUser(session?.user ? {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name as string | undefined,
          photoURL: session.user.user_metadata?.avatar_url as string | undefined,
        } : null)
      } catch (error) {
        console.error('Error checking session:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name as string | undefined,
        photoURL: session.user.user_metadata?.avatar_url as string | undefined,
      } : null)
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  return { user, loading }
}
