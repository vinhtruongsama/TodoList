import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Tạo Supabase Client chạy trên Server.
 * Được sử dụng trong Server Components, Server Actions và Route Handlers.
 */
export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Thiếu biến môi trường Supabase. Hãy kiểm tra file .env.local'
    )
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Ghi chú: catch này xử lý trường hợp setAll được gọi từ Server Component (nơi không thể set cookie)
          // Điều này là bình thường trong Next.js App Router.
        }
      },
    },
  })
}
