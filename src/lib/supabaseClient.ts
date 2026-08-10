import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''

// Create Supabase client (works on both client and server)
// Use a singleton pattern to avoid creating multiple clients
declare global {
  var supabaseClient: ReturnType<typeof createClient> | null
}

export const supabase = globalThis.supabaseClient ?? createClient(supabaseUrl, supabaseKey)

// For hot reload in development
if (process.env.NODE_ENV !== 'production') {
  globalThis.supabaseClient = supabase
}
