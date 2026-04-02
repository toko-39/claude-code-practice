'use client'

import { useTransition } from 'react'
import { markAsCompleted } from '@/actions/progress'

export default function CompleteButton({
  lessonId,
  courseId,
  completed,
}: {
  lessonId: string
  courseId: string
  completed: boolean
}) {
  const [isPending, startTransition] = useTransition()

  if (completed) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-green-50 px-5 py-2.5 text-sm font-semibold text-green-700 ring-1 ring-green-200">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
        </svg>
        視聴済み
      </div>
    )
  }

  return (
    <button
      onClick={() => startTransition(() => markAsCompleted(lessonId, courseId))}
      disabled={isPending}
      className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-700 active:scale-[0.98] disabled:opacity-60"
    >
      {isPending ? (
        <>
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          記録中...
        </>
      ) : (
        <>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
          視聴済みにする
        </>
      )}
    </button>
  )
}
