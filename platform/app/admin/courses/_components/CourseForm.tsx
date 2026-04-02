'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Tables } from '@/lib/supabase/types'
import { createCourse, updateCourse, CourseFormState } from '@/actions/admin/courses'

type Course = Tables<'courses'>

export default function CourseForm({ course }: { course?: Course }) {
  const action = course
    ? updateCourse.bind(null, course.id)
    : createCourse

  const [state, formAction, isPending] = useActionState<CourseFormState, FormData>(action, null)
  const isEdit = !!course

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {state.error}
        </div>
      )}

      {/* タイトル */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium text-gray-700">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={course?.title ?? ''}
          placeholder="例：はじめてのTypeScript入門"
          className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-3 focus:ring-violet-100"
        />
      </div>

      {/* 説明文 */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          説明文
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={course?.description ?? ''}
          placeholder="講座の概要や学べる内容を入力してください"
          className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-3 focus:ring-violet-100 resize-none"
        />
      </div>

      {/* サムネイル URL */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="thumbnail_url" className="text-sm font-medium text-gray-700">
          サムネイル URL
        </label>
        <input
          id="thumbnail_url"
          name="thumbnail_url"
          type="url"
          defaultValue={course?.thumbnail_url ?? ''}
          placeholder="https://example.com/thumbnail.jpg"
          className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-3 focus:ring-violet-100"
        />
      </div>

      {/* 公開フラグ */}
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-violet-200 hover:bg-violet-50/50">
        <input
          name="published"
          type="checkbox"
          defaultChecked={course?.published ?? false}
          className="h-4 w-4 accent-violet-600"
        />
        <div>
          <p className="text-sm font-medium text-gray-800">受講者に公開する</p>
          <p className="text-xs text-gray-400">ON にすると /courses に表示されます</p>
        </div>
      </label>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-700 active:scale-[0.98] disabled:opacity-60"
        >
          {isPending && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {isPending ? '保存中...' : isEdit ? '変更を保存' : '講座を作成'}
        </button>
        <Link
          href="/admin/courses"
          className="flex h-10 items-center rounded-xl border border-gray-200 px-5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          キャンセル
        </Link>
      </div>
    </form>
  )
}
