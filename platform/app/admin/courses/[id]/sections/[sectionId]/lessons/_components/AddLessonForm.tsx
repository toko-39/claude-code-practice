'use client'

import { useActionState, useEffect, useRef } from 'react'
import { createLesson } from '@/actions/admin/lessons'

export default function AddLessonForm({
  sectionId,
  courseId,
}: {
  sectionId: string
  courseId: string
}) {
  const action = createLesson.bind(null, sectionId, courseId)
  const [state, formAction, isPending] = useActionState(action, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!state && !isPending) formRef.current?.reset()
  }, [state, isPending])

  return (
    <form ref={formRef} action={formAction} className="border-t border-gray-100 pt-4">
      <div className="flex flex-wrap items-start gap-2">
        {/* タイトル */}
        <div className="min-w-40 flex-1">
          <input
            name="title"
            type="text"
            required
            placeholder="レッスンタイトル"
            className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-3 focus:ring-violet-100"
          />
        </div>

        {/* YouTube URL / ID */}
        <div className="w-60">
          <input
            name="youtube_id"
            type="text"
            required
            placeholder="YouTube URL または動画 ID"
            className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-3 focus:ring-violet-100"
          />
        </div>

        {/* 動画時間 */}
        <div className="w-28">
          <input
            name="duration_sec"
            type="number"
            min={0}
            placeholder="秒数（任意）"
            className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-3 focus:ring-violet-100"
          />
        </div>

        {/* 追加ボタン */}
        <button
          type="submit"
          disabled={isPending}
          className="flex h-10 items-center gap-1.5 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition-all hover:bg-violet-700 active:scale-[0.98] disabled:opacity-60"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {isPending ? '追加中...' : '追加'}
        </button>
      </div>

      {state?.error && (
        <p className="mt-2 text-xs text-red-500">{state.error}</p>
      )}
    </form>
  )
}
