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

export default function LessonSidebar({
  sections,
  courseId,
  currentLessonId,
  completedIds,
}: {
  sections: SectionWithLessons[]
  courseId: string
  currentLessonId: string
  completedIds: Set<string>
}) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.id))
  )

  const toggle = (id: string) =>
    setOpenSections((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {sections.map((section, si) => {
        const isOpen = openSections.has(section.id)
        return (
          <div key={section.id}>
            <button
              onClick={() => toggle(section.id)}
              className="flex w-full items-center justify-between bg-gray-50 px-4 py-3 text-left hover:bg-gray-100 transition-colors"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {si + 1}. {section.title}
              </span>
              <svg
                className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <ul>
                {section.lessons.map((lesson, li) => {
                  const isCurrent = lesson.id === currentLessonId
                  const isCompleted = completedIds.has(lesson.id)
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/courses/${courseId}/lessons/${lesson.id}`}
                        className={`flex items-start gap-3 px-4 py-3 text-sm transition-colors ${
                          isCurrent
                            ? 'bg-violet-50 text-violet-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                            isCompleted
                              ? 'border-violet-500 bg-violet-500'
                              : isCurrent
                              ? 'border-violet-400'
                              : 'border-gray-300'
                          }`}
                        >
                          {isCompleted && (
                            <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`flex-1 leading-snug ${isCurrent ? 'font-medium' : ''}`}>
                          {li + 1}. {lesson.title}
                        </span>
                        {lesson.duration_sec && (
                          <span className="shrink-0 text-xs text-gray-400">
                            {formatDuration(lesson.duration_sec)}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
