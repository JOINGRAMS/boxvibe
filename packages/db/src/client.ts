import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import type { Database } from './types'

// Re-export for convenience
export type { Database }

// ─── Environment variable helpers ──────────────────────────────────────────

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_URL')
  return url
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY')
  return key
}

// ─── Browser client (Client Components) ────────────────────────────────────

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(getSupabaseUrl(), getSupabaseAnonKey())
}

// ─── Server client (Server Components, Server Actions, Route Handlers) ──────
// Usage: import { createSupabaseServerClient } from '@boxvibe/db'
// Must be called inside async server context with access to cookies

export type CookieStore = {
  get: (name: string) => { value: string } | undefined
  set: (name: string, value: string, options: object) => void
  delete: (name: string) => void
}

export function createSupabaseServerClient(cookieStore: CookieStore) {
  return createServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: object) {
        cookieStore.set(name, value, options)
      },
      remove(name: string, options: object) {
        cookieStore.set(name, '', options)
      },
    },
  })
}

// ─── Admin client (Server-side only — bypasses RLS via service role key) ───
// Never use in client-side code or expose to the browser

export function createSupabaseAdminClient() {
  const url = getSupabaseUrl()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY')
  return createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
