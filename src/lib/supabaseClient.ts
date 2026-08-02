import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tj-projects-maybe-time-to-books.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqLXByb2plY3RzLW1heWJlLXRpbWUtdG8tYm9va3MiLCJpYXQiOjE3MTYyNjQwMDB9.0JzQJQ5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5' // Fake key for demo

export const supabase = createClient(supabaseUrl, supabaseKey)
