import { notFound } from 'next/navigation'
import { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import YoutubePlayer from '@/components/YoutubePlayer'
import CompleteButton from '@/components/CompleteButton'
import LessonSidebar from './_components/LessonSidebar'

type Props = { params: Promise<{ id: string; lessonId: string }> }

// generateMetadata とページ本体で同一リクエスト内のクエリを共有
const getLesson = cache(async (lessonId: string) => {
  const supabase = await createClient()
  return supabase.from('lessons').select('*').eq('id', lessonId).single()
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonId } = await params
  const { data } = await getLesson(lessonId)
  return { title: data?.title ?? 'レッスン' }
}

export default async function LessonPage({ params }: Props) {
  const { id: courseId, lessonId } = await params
  const supabase = await createClient()

  // レッスン・コース・セクションを並列取得
  const [{ data: lesson, error }, { data: course }, { data: sections }] = await Promise.all([
    getLesson(lessonId),
    supabase.from('courses').select('id, title').eq('id', courseId).single(),
    supabase.from('sections').select('*').eq('course_id', courseId).order('order_index'),
  ])

  if (error || !lesson || !course) notFound()

  // セクションIDが確定してからレッスン一覧と進捗を並列取得（N+1クエリ解消）
  const sectionIds = sections?.map((s) => s.id) ?? []
  const [{ data: allLessons }, { data: progressData }] = await Promise.all([
    sectionIds.length > 0
      ? supabase.from('lessons').select('*').in('section_id', sectionIds).order('order_index')
      : Promise.resolve({ data: [] as typeof lesson[], error: null }),
    supabase.from('progress').select('lesson_id').eq('completed', true),
  ])

  // 完了済みレッスンIDのSet
  const completedIds = new Set(progressData?.map((p) => p.lesson_id ?? '').filter(Boolean))
  const isCompleted = completedIds.has(lessonId)

  // セクション × レッスン結合（サイドバー用）
  const sectionsWithLessons = (sections ?? []).map((s) => ({
    ...s,
    lessons: (allLessons ?? []).filter((l) => l.section_id === s.id),
  }))

  // コース全体のフラットなレッスン一覧（order順）
  const flatLessons = sectionsWithLessons.flatMap((s) => s.lessons)
  const currentIndex = flatLessons.findIndex((l) => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      {/* ===== Main ===== */}
      <div className="flex flex-1 flex-col">
        {/* Dark header */}
        <div className="bg-gray-900 px-4 py-3 md:px-6">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/courses" className="text-gray-400 hover:text-white transition-colors">
              コース一覧
            </Link>
            <svg className="h-3.5 w-3.5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
            </svg>
            <Link
              href={`/courses/${courseId}`}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {course.title}
            </Link>
            <svg className="h-3.5 w-3.5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
            </svg>
            <span className="truncate text-white">{lesson.title}</span>
          </div>
        </div>

        {/* Player area */}
        <div className="bg-gray-950 px-4 py-6 md:px-8">
          <YoutubePlayer youtubeId={lesson.youtube_id} />
        </div>

        {/* Lesson info + actions */}
        <div className="flex-1 px-4 py-6 md:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
            <CompleteButton
              lessonId={lessonId}
              courseId={courseId}
              completed={isCompleted}
            />
          </div>

          {/* Prev / Next navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
            {prevLesson ? (
              <Link
                href={`/courses/${courseId}/lessons/${prevLesson.id}`}
                className="group flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
              >
                <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                <span className="max-w-[200px] truncate">{prevLesson.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {nextLesson && (
              <Link
                href={`/courses/${courseId}/lessons/${nextLesson.id}`}
                className="group flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-violet-700"
              >
                <span className="max-w-[200px] truncate">{nextLesson.title}</span>
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ===== Sidebar ===== */}
      <aside className="w-full shrink-0 border-t border-gray-200 bg-white lg:w-80 lg:border-l lg:border-t-0 xl:w-96">
        <div className="sticky top-16 flex flex-col" style={{ maxHeight: 'calc(100vh - 64px)' }}>
          <div className="border-b border-gray-200 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">コースの内容</p>
          </div>
          <div className="overflow-y-auto">
            <LessonSidebar
              sections={sectionsWithLessons}
              courseId={courseId}
              currentLessonId={lessonId}
              completedIds={completedIds}
            />
          </div>
        </div>
      </aside>
    </div>
  )
}
