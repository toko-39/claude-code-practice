import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // JWT を検証しトークンを更新する（getSession() は使わない）
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims

  const { pathname } = request.nextUrl

  // 未ログインは /login へ
  if (!claims) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // /admin/** は admin ロールのみ許可
  if (pathname.startsWith('/admin')) {
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', claims.sub)
      .single()

    if (user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/courses', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/courses/:path*', '/admin', '/admin/:path*'],
}
