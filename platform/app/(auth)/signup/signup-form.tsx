'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signup } from '@/actions/auth'
import GoogleSignInButton from '@/components/google-signin-button'

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, null)

  return (
    <div className="rounded-2xl bg-white px-8 py-10 shadow-2xl shadow-black/20 ring-1 ring-white/10">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-500/30">
          <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6 translate-x-px">
            <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82z"/>
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">アカウントを作成</h1>
          <p className="mt-1 text-sm text-gray-500">無料で学習をはじめましょう</p>
        </div>
      </div>

      {/* Google */}
      <GoogleSignInButton />

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <hr className="flex-1 border-gray-200" />
        <span className="text-xs font-medium text-gray-400">またはメールで続ける</span>
        <hr className="flex-1 border-gray-200" />
      </div>

      {/* Form */}
      <form action={formAction} className="flex flex-col gap-4">
        {state?.error && (
          <div className="flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
            <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{state.error}</span>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-3 focus:ring-violet-100"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            パスワード
            <span className="ml-1 font-normal text-gray-400">（6文字以上）</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="••••••••"
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-3 focus:ring-violet-100"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-1 flex h-11 items-center justify-center rounded-xl bg-violet-600 text-sm font-semibold text-white shadow-sm shadow-violet-500/30 transition-all hover:bg-violet-700 hover:shadow-md hover:shadow-violet-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              登録中...
            </span>
          ) : '無料で始める'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        すでにアカウントをお持ちの方は{' '}
        <Link href="/login" className="font-medium text-violet-600 hover:text-violet-700 hover:underline">
          ログイン
        </Link>
      </p>
    </div>
  )
}
