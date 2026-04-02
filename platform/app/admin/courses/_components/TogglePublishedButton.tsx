'use client'

import { useTransition } from 'react'
import { togglePublished } from '@/actions/admin/courses'

export default function TogglePublishedButton({
  id,
  published,
}: {
  id: string
  published: boolean
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => togglePublished(id, published))}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all disabled:opacity-50 ${
        published
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${published ? 'bg-green-500' : 'bg-gray-400'}`}
      />
      {isPending ? '更新中...' : published ? '公開中' : '非公開'}
    </button>
  )
}
