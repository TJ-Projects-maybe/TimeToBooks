"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "../supabaseClient"
import { User } from "../types"

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()
    
    if (!supabase) {
      // Supabase not available (missing env vars or SSR)
      setUser(null)
      setLoading(false)
      return
    }

    // Check current session with timeout
    const checkSession = async () => {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 5000)
        )
        
        const sessionPromise = supabase.auth.getSession()
        
        const result = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as { data: { session: any } }
        
        setUser(result.data.session?.user ? {
          id: result.data.session.user.id,
          email: result.data.session.user.email || '',
          name: result.data.session.user.user_metadata?.name as string | undefined,
          photoURL: result.data.session.user.user_metadata?.avatar_url as string | undefined,
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
