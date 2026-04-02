'use client'

import { useState, useTransition } from 'react'
import { Tables } from '@/lib/supabase/types'
import { updateLesson, deleteLesson, reorderLessons } from '@/actions/admin/lessons'

type Lesson = Tables<'lessons'>

function formatDuration(sec: number | null): string {
  if (!sec) return '—'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function EditForm({
  lesson,
  courseId,
  sectionId,
  onDone,
}: {
  lesson: Lesson
  courseId: string
  sectionId: string
  onDone: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updateLesson(lesson.id, courseId, sectionId, formData)
      if (result?.error) {
        setError(result.error)
      } else {
        onDone()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-wrap items-center gap-2">
      <input
        name="title"
        defaultValue={lesson.title}
        autoFocus
        required
        placeholder="タイトル"
        className="h-8 min-w-32 flex-1 rounded-lg border border-violet-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-violet-100"
      />
      <input
        name="youtube_id"
        defaultValue={lesson.youtube_id}
        required
        placeholder="YouTube URL または ID"
        className="h-8 w-52 rounded-lg border border-violet-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-violet-100"
      />
      <input
        name="duration_sec"
        type="number"
        min={0}
        defaultValue={lesson.duration_sec ?? ''}
        placeholder="秒数"
        className="h-8 w-24 rounded-lg border border-violet-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-violet-100"
      />
      {error && <span className="w-full text-xs text-red-500">{error}</span>}
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

export default function LessonListClient({
  initialLessons,
  courseId,
  sectionId,
}: {
  initialLessons: Lesson[]
  courseId: string
  sectionId: string
}) {
  const [lessons, setLessons] = useState(initialLessons)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const move = (index: number, direction: 'up' | 'down') => {
    const next = [...lessons]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
    setLessons(next)
    startTransition(() => reorderLessons(courseId, sectionId, next.map((l) => l.id)))
  }

  const handleDelete = (id: string) => {
    if (!confirm('このレッスンを削除しますか？\n視聴進捗データも削除されます。')) return
    setLessons((prev) => prev.filter((l) => l.id !== id))
    startTransition(() => deleteLesson(id, courseId, sectionId))
  }

  if (lessons.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        レッスンがありません。下のフォームから追加してください。
      </p>
    )
  }

  return (
    <ul className="divide-y divide-gray-50">
      {lessons.map((lesson, index) => (
        <li key={lesson.id} className="flex items-center gap-3 px-5 py-3.5">
          {/* 順番 */}
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
            {index + 1}
          </span>

          {/* タイトル (編集 or 表示) */}
          {editingId === lesson.id ? (
            <EditForm
              lesson={lesson}
              courseId={courseId}
              sectionId={sectionId}
              onDone={() => setEditingId(null)}
            />
          ) : (
            <span className="flex-1 text-sm font-medium text-gray-800">{lesson.title}</span>
          )}

          {/* YouTube ID */}
          {editingId !== lesson.id && (
            <span className="hidden shrink-0 font-mono text-xs text-gray-400 sm:block">
              {lesson.youtube_id}
            </span>
          )}

          {/* 動画時間 */}
          {editingId !== lesson.id && (
            <span className="shrink-0 text-xs text-gray-400">
              {formatDuration(lesson.duration_sec)}
            </span>
          )}

          {/* 操作ボタン */}
          {editingId !== lesson.id && (
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
                disabled={index === lessons.length - 1 || isPending}
                className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
                title="下へ"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* 編集 */}
              <button
                onClick={() => setEditingId(lesson.id)}
                className="rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
              >
                編集
              </button>

              {/* 削除 */}
              <button
                onClick={() => handleDelete(lesson.id)}
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
