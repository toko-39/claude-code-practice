import type { Metadata } from 'next'
import Link from 'next/link'
import CourseForm from '../_components/CourseForm'

export const metadata: Metadata = { title: '講座を作成' }

export default function NewCoursePage() {
  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <Link
          href="/admin/courses"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-600"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          講座管理に戻る
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">新規講座を作成</h1>
      </div>

      <div className="max-w-2xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <CourseForm />
      </div>
    </div>
  )
}
