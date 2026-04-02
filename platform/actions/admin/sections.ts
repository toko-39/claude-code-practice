'use server'

import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/assert-admin'
import { revalidatePath } from 'next/cache'

function revalidate(courseId: string) {
  revalidatePath(`/admin/courses/${courseId}/sections`)
  revalidatePath(`/courses/${courseId}`)
}

export type SectionFormState = { error: string } | null

export async function createSection(
  courseId: string,
  prevState: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await assertAdmin()

  const title = (formData.get('title') as string).trim()
  if (!title) return { error: 'タイトルは必須です' }
  if (title.length > 200) return { error: 'タイトルは200文字以内で入力してください' }

  const supabase = await createClient()

  const { data: last } = await supabase
    .from('sections')
    .select('order_index')
    .eq('course_id', courseId)
    .order('order_index', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { error } = await supabase.from('sections').insert({
    course_id: courseId,
    title,
    order_index: (last?.order_index ?? -1) + 1,
  })

  if (error) return { error: 'データの保存に失敗しました' }

  revalidate(courseId)
  return null
}

export async function updateSection(
  id: string,
  courseId: string,
  formData: FormData
): Promise<SectionFormState> {
  await assertAdmin()

  const title = (formData.get('title') as string).trim()
  if (!title) return { error: 'タイトルは必須です' }
  if (title.length > 200) return { error: 'タイトルは200文字以内で入力してください' }

  const supabase = await createClient()
  const { error } = await supabase.from('sections').update({ title }).eq('id', id)

  if (error) return { error: 'データの更新に失敗しました' }

  revalidate(courseId)
  return null
}

export async function deleteSection(id: string, courseId: string) {
  await assertAdmin()
  const supabase = await createClient()
  await supabase.from('sections').delete().eq('id', id)
  revalidate(courseId)
}

export async function reorderSections(courseId: string, ids: string[]) {
  await assertAdmin()
  const supabase = await createClient()
  await Promise.all(
    ids.map((id, index) =>
      supabase.from('sections').update({ order_index: index }).eq('id', id)
    )
  )
  revalidate(courseId)
}
