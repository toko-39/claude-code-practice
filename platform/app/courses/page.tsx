import { createClient } from '@/lib/supabase/server'
import CourseCard from '@/components/CourseCard'

export const revalidate = 3600

export default async function CoursesPage() {
  const supabase = await createClient()

  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">コース一覧</h1>
        <p className="mt-2 text-gray-500">
          {courses.length > 0
            ? `${courses.length}件のコースが公開されています`
            : 'コースを探してみましょう'}
        </p>
      </div>

      {/* Empty state */}
      {courses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">
            <svg className="h-8 w-8 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125V10.875a1.125 1.125 0 0 1 1.125-1.125h1.5m0 0V4.875A1.125 1.125 0 0 1 6 3.75h12a1.125 1.125 0 0 1 1.125 1.125V18.375a1.125 1.125 0 0 1-1.125 1.125M6 9.75h12M6 12h12m-6 3h2.25" />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-semibold text-gray-900">コースがまだありません</h2>
          <p className="mt-1 text-sm text-gray-400">公開されているコースが見つかりませんでした。</p>
        </div>
      )}

      {/* Course grid */}
      {courses.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </main>
  )
}
