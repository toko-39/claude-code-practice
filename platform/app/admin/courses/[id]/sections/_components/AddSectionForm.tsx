'use client'

import { useActionState, useEffect, useRef } from 'react'
import { createSection } from '@/actions/admin/sections'

export default function AddSectionForm({ courseId }: { courseId: string }) {
  const action = createSection.bind(null, courseId)
  const [state, formAction, isPending] = useActionState(action, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!state && !isPending) formRef.current?.reset()
  }, [state, isPending])

  return (
    <form ref={formRef} action={formAction} className="flex items-start gap-2 border-t border-gray-100 pt-4">
      <div className="flex-1">
        <input
          name="title"
          type="text"
          required
          placeholder="新しいセクションのタイトル"
          className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-3 focus:ring-violet-100"
        />
        {state?.error && (
          <p className="mt-1 text-xs text-red-500">{state.error}</p>
        )}
      </div>
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
    </form>
  )
}
