import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

/**
 * Admin Supabase client that bypasses RLS
 * Use only for server-side operations that need to bypass row-level security
 * Example: tracking API calls that increment impressions/clicks
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRole) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
