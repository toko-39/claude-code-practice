import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './logout-button'

export default async function Header() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const isLoggedIn = !!data?.claims

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 md:px-6">
        {/* Logo */}
        <Link href="/courses" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
            <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4 translate-x-px">
              <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82z"/>
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">LearnHub</span>
        </Link>

        <div className="flex-1" />

        {/* Auth */}
        <nav className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link
                href="/courses"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                コース一覧
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                ログイン
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-violet-700 hover:shadow-md active:scale-[0.98]"
              >
                無料で始める
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
