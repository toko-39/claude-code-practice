import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import DeleteCourseButton from './_components/DeleteCourseButton'
import TogglePublishedButton from './_components/TogglePublishedButton'

export const metadata: Metadata = { title: '講座管理' }

export default async function AdminCoursesPage() {
  const supabase = await createClient()
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">講座管理</h1>
          <p className="mt-0.5 text-sm text-gray-500">{courses.length} 件の講座</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-700 active:scale-[0.98]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          新規作成
        </Link>
      </div>

      {/* Empty state */}
      {courses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
          <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75z" />
          </svg>
          <p className="mt-3 text-sm font-medium text-gray-500">講座がまだありません</p>
          <Link href="/admin/courses/new" className="mt-4 text-sm font-medium text-violet-600 hover:underline">
            最初の講座を作成する →
          </Link>
        </div>
      )}

      {/* Table */}
      {courses.length > 0 && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                <th className="px-5 py-3.5">講座</th>
                <th className="px-5 py-3.5">ステータス</th>
                <th className="px-5 py-3.5">作成日</th>
                <th className="px-5 py-3.5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {courses.map((course) => (
                <tr key={course.id} className="group transition-colors hover:bg-gray-50/60">
                  {/* 講座 */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100">
                        {course.thumbnail_url ? (
                          <Image
                            src={course.thumbnail_url}
                            alt={course.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <svg className="h-5 w-5 text-violet-300" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{course.title}</p>
                        {course.description && (
                          <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">{course.description}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* ステータス */}
                  <td className="px-5 py-4">
                    <TogglePublishedButton id={course.id} published={course.published} />
                  </td>

                  {/* 作成日 */}
                  <td className="px-5 py-4 text-xs text-gray-400">
                    {course.created_at
                      ? new Date(course.created_at).toLocaleDateString('ja-JP')
                      : '—'}
                  </td>

                  {/* 操作 */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
                      >
                        編集
                      </Link>
                      <Link
                        href={`/admin/courses/${course.id}/sections`}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-violet-600 transition-colors hover:bg-violet-50"
                      >
                        セクション
                      </Link>
                      <DeleteCourseButton id={course.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
