import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware để cập nhật session của Supabase.
 * Đảm bảo các token xác thực luôn được làm mới.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Nếu chưa có env, bỏ qua middleware để không gây lỗi crash app lúc dev
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        // Cập nhật cookies cho request ban đầu
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set({ name, value, ...options })
        )
        // Tạo response mới để gắn các cookies đã cập nhật
        supabaseResponse = NextResponse.next({
          request,
        })
        // Cập nhật cookies cho response sẽ trả về trình duyệt
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set({ name, value, ...options })
        )
      },
    },
  })

  // QUAN TRỌNG: Đừng viết code gì ở giữa createServerClient và getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register') ||
                     request.nextUrl.pathname.startsWith('/auth')

  if (!user && !isAuthPage) {
    // Chưa đăng nhập và không ở trang auth -> Về trang login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    // Đã đăng nhập nhưng lại vào trang login/register -> Vào Dashboard
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
