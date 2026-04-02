import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LessonListClient from './_components/LessonListClient'
import AddLessonForm from './_components/AddLessonForm'

type Props = { params: Promise<{ id: string; sectionId: string }> }

export const metadata: Metadata = { title: 'レッスン管理' }

export default async function AdminLessonsPage({ params }: Props) {
  const { id: courseId, sectionId } = await params
  const supabase = await createClient()

  const [{ data: course, error: courseError }, { data: section, error: sectionError }, { data: lessons }] =
    await Promise.all([
      supabase.from('courses').select('id, title').eq('id', courseId).single(),
      supabase.from('sections').select('id, title').eq('id', sectionId).single(),
      supabase.from('lessons').select('*').eq('section_id', sectionId).order('order_index'),
    ])

  if (courseError || !course || sectionError || !section) notFound()

  return (
    <div className="px-6 py-8">
      {/* Breadcrumb */}
      <div className="mb-1 flex items-center gap-1.5 text-sm text-gray-400">
        <Link href="/admin/courses" className="hover:text-gray-600 transition-colors">
          講座管理
        </Link>
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
        </svg>
        <span className="text-gray-600">{course.title}</span>
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
        </svg>
        <Link
          href={`/admin/courses/${courseId}/sections`}
          className="hover:text-gray-600 transition-colors"
        >
          セクション管理
        </Link>
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
        </svg>
        <span className="text-gray-600">{section.title}</span>
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
        </svg>
        <span className="text-gray-900">レッスン管理</span>
      </div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">レッスン管理</h1>
          <p className="mt-0.5 text-sm text-gray-500">{lessons?.length ?? 0} レッスン</p>
        </div>
        <Link
          href={`/admin/courses/${courseId}/sections`}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 19.5-7.5-7.5 7.5-7.5" />
          </svg>
          セクション管理に戻る
        </Link>
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* Table header */}
        <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <span className="w-6" />
            <span className="flex-1">タイトル</span>
            <span className="hidden shrink-0 sm:block">YouTube ID</span>
            <span className="shrink-0">時間</span>
            <span className="shrink-0 w-24 text-right">操作</span>
          </div>
        </div>

        {/* Lesson list */}
        <LessonListClient
          initialLessons={lessons ?? []}
          courseId={courseId}
          sectionId={sectionId}
        />

        {/* Add form */}
        <div className="px-5 pb-5 pt-2">
          <AddLessonForm sectionId={sectionId} courseId={courseId} />
        </div>
      </div>
    </div>
  )
}
