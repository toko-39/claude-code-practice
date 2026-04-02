'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Tables } from '@/lib/supabase/types'

type Lesson = Tables<'lessons'>
type SectionWithLessons = Tables<'sections'> & { lessons: Lesson[] }

function formatDuration(sec: number | null): string {
  if (!sec) return ''
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function SectionItem({
  section,
  courseId,
  completedIds,
  index,
}: {
  section: SectionWithLessons
  courseId: string
  completedIds: Set<string>
  index: number
}) {
  const [open, setOpen] = useState(true)
  const completedCount = section.lessons.filter((l) => completedIds.has(l.id)).length
  const totalDuration = section.lessons.reduce((sum, l) => sum + (l.duration_sec ?? 0), 0)

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Section header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
            {index + 1}
          </span>
          <span className="font-semibold text-gray-900">{section.title}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span>
            {completedCount}/{section.lessons.length} 完了
          </span>
          {totalDuration > 0 && (
            <span>{formatDuration(totalDuration)}</span>
          )}
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Lessons */}
      {open && (
        <ul className="divide-y divide-gray-100 border-t border-gray-100">
          {section.lessons.map((lesson, li) => {
            const completed = completedIds.has(lesson.id)
            return (
              <li key={lesson.id}>
                <Link
                  href={`/courses/${courseId}/lessons/${lesson.id}`}
                  className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-violet-50"
                >
                  {/* Completed indicator */}
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      completed
                        ? 'border-violet-600 bg-violet-600'
                        : 'border-gray-300 group-hover:border-violet-400'
                    }`}
                  >
                    {completed && (
                      <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Play icon */}
                  <svg
                    className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-violet-600 transition-colors"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82z" />
                  </svg>

                  {/* Title */}
                  <span className="flex-1 text-sm text-gray-700 group-hover:text-violet-700 transition-colors">
                    {li + 1}. {lesson.title}
                  </span>

                  {/* Duration + badge */}
                  <div className="flex items-center gap-2 shrink-0">
                    {completed && (
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                        視聴済み
                      </span>
                    )}
                    {lesson.duration_sec && (
                      <span className="text-xs text-gray-400">{formatDuration(lesson.duration_sec)}</span>
                    )}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default function SectionList({
  sections,
  courseId,
  completedIds,
}: {
  sections: SectionWithLessons[]
  courseId: string
  completedIds: Set<string>
}) {
  return (
    <div className="flex flex-col gap-3">
      {sections.map((section, i) => (
        <SectionItem
          key={section.id}
          section={section}
          courseId={courseId}
          completedIds={completedIds}
          index={i}
        />
      ))}
    </div>
  )
}
