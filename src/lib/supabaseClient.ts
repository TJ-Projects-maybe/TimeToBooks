import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Client-side only
export const supabase = typeof window !== 'undefined'
  ? createClient(supabaseUrl, supabaseKey)
  : null
