import { createBrowserClient } from '@supabase/ssr'

/**
 * Tạo Supabase Client chạy trên trình duyệt.
 * Được sử dụng trong các Client Components.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Thiếu biến môi trường Supabase. Hãy kiểm tra file .env.local'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
