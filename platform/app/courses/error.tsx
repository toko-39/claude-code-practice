'use client'

import { useEffect } from 'react'

export default function CoursesError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
        <svg className="h-8 w-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">エラーが発生しました</h2>
      <p className="mt-1 text-sm text-gray-500">講座の読み込みに失敗しました。もう一度お試しください。</p>
      <button
        onClick={reset}
        className="mt-6 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
      >
        再試行
      </button>
    </main>
  )
}
