'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Tables } from '@/lib/supabase/types'
import { updateSection, deleteSection, reorderSections } from '@/actions/admin/sections'

type Section = Tables<'sections'> & { lessonCount: number }

function EditForm({
  section,
  courseId,
  onDone,
}: {
  section: Section
  courseId: string
  onDone: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updateSection(section.id, courseId, formData)
      if (result?.error) {
        setError(result.error)
      } else {
        onDone()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-2">
      <input
        name="title"
        defaultValue={section.title}
        autoFocus
        required
        className="h-8 flex-1 rounded-lg border border-violet-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-violet-100"
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
      >
        保存
      </button>
      <button
        type="button"
        onClick={onDone}
        className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100"
      >
        取消
      </button>
    </form>
  )
}

export default function SectionListClient({
  initialSections,
  courseId,
}: {
  initialSections: Section[]
  courseId: string
}) {
  const [sections, setSections] = useState(initialSections)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const move = (index: number, direction: 'up' | 'down') => {
    const next = [...sections]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
    setSections(next)
    startTransition(() => reorderSections(courseId, next.map((s) => s.id)))
  }

  const handleDelete = (id: string) => {
    if (!confirm('このセクションを削除しますか？\n配下のレッスンもすべて削除されます。')) return
    setSections((prev) => prev.filter((s) => s.id !== id))
    startTransition(() => deleteSection(id, courseId))
  }

  if (sections.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        セクションがありません。下のフォームから追加してください。
      </p>
    )
  }

  return (
    <ul className="divide-y divide-gray-50">
      {sections.map((section, index) => (
        <li key={section.id} className="flex items-center gap-3 px-5 py-3.5">
          {/* 順番 */}
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
            {index + 1}
          </span>

          {/* タイトル (編集 or 表示) */}
          {editingId === section.id ? (
            <EditForm
              section={section}
              courseId={courseId}
              onDone={() => setEditingId(null)}
            />
          ) : (
            <span className="flex-1 text-sm font-medium text-gray-800">{section.title}</span>
          )}

          {/* レッスン数 */}
          {editingId !== section.id && (
            <span className="shrink-0 text-xs text-gray-400">{section.lessonCount} レッスン</span>
          )}

          {/* 操作ボタン */}
          {editingId !== section.id && (
            <div className="flex shrink-0 items-center gap-1">
              {/* 上下 */}
              <button
                onClick={() => move(index, 'up')}
                disabled={index === 0 || isPending}
                className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
                title="上へ"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
              </button>
              <button
                onClick={() => move(index, 'down')}
                disabled={index === sections.length - 1 || isPending}
                className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
                title="下へ"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* 編集 */}
              <button
                onClick={() => setEditingId(section.id)}
                className="rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
              >
                編集
              </button>

              {/* レッスン */}
              <Link
                href={`/admin/courses/${courseId}/sections/${section.id}/lessons`}
                className="rounded-lg px-2.5 py-1 text-xs font-medium text-violet-600 transition-colors hover:bg-violet-50"
              >
                レッスン
              </Link>

              {/* 削除 */}
              <button
                onClick={() => handleDelete(section.id)}
                className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
              >
                削除
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
