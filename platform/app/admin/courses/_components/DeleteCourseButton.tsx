'use client'

import { useTransition } from 'react'
import { deleteCourse } from '@/actions/admin/courses'

export default function DeleteCourseButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    if (!confirm('この講座を削除しますか？\nセクション・レッスンもすべて削除されます。')) return
    startTransition(() => deleteCourse(id))
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
    >
      {isPending ? '削除中...' : '削除'}
    </button>
  )
}
