import { createClient } from '@supabase/supabase-js'

// Client-side only Supabase client
// This will only work in the browser
declare global {
  var supabaseClient: ReturnType<typeof createClient> | null
}

const supabaseUrl = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_SUPABASE_URL || '')
  : ''

const supabaseKey = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
  : ''

if (typeof window !== 'undefined' && !globalThis.supabaseClient) {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase configuration is missing!')
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  } else {
    globalThis.supabaseClient = createClient(supabaseUrl, supabaseKey)
  }
}

export const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    return null
  }
  return globalThis.supabaseClient
}

// For backward compatibility
export const supabase = globalThis.supabaseClient
