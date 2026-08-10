import { createClient } from '@supabase/supabase-js'

// Only create the client on the client-side
// This prevents errors during server-side rendering
let supabaseClient: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    // Server-side: return null (should not be used)
    return null
  }
  
  // Client-side: create or return existing client
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase URL or Anon Key is missing!')
      return null
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseKey)
  }
  
  return supabaseClient
}

// For backward compatibility with existing code
export const supabase = getSupabaseClient()
