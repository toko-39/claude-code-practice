'use server'

import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/assert-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type CourseFormState = { error: string } | null

function revalidateAll() {
  revalidatePath('/admin/courses')
  revalidatePath('/courses')
}

/** https:// または http:// で始まる URL か検証する */
function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export async function createCourse(
  prevState: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
  await assertAdmin()

  const title = (formData.get('title') as string).trim()
  if (!title) return { error: 'タイトルは必須です' }
  if (title.length > 200) return { error: 'タイトルは200文字以内で入力してください' }

  const thumbnailRaw = (formData.get('thumbnail_url') as string).trim()
  if (thumbnailRaw && !isValidUrl(thumbnailRaw)) {
    return { error: 'サムネイル URL は http:// または https:// で始まる URL を入力してください' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('courses').insert({
    title,
    description: (formData.get('description') as string).trim() || null,
    thumbnail_url: thumbnailRaw || null,
    published: formData.get('published') === 'on',
  })

  if (error) return { error: 'データの保存に失敗しました' }

  revalidateAll()
  redirect('/admin/courses')
}

export async function updateCourse(
  id: string,
  prevState: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
  await assertAdmin()

  const title = (formData.get('title') as string).trim()
  if (!title) return { error: 'タイトルは必須です' }
  if (title.length > 200) return { error: 'タイトルは200文字以内で入力してください' }

  const thumbnailRaw = (formData.get('thumbnail_url') as string).trim()
  if (thumbnailRaw && !isValidUrl(thumbnailRaw)) {
    return { error: 'サムネイル URL は http:// または https:// で始まる URL を入力してください' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('courses')
    .update({
      title,
      description: (formData.get('description') as string).trim() || null,
      thumbnail_url: thumbnailRaw || null,
      published: formData.get('published') === 'on',
    })
    .eq('id', id)

  if (error) return { error: 'データの更新に失敗しました' }

  revalidateAll()
  redirect('/admin/courses')
}

export async function deleteCourse(id: string) {
  await assertAdmin()
  const supabase = await createClient()
  await supabase.from('courses').delete().eq('id', id)
  revalidateAll()
}

export async function togglePublished(id: string, published: boolean) {
  await assertAdmin()
  const supabase = await createClient()
  await supabase.from('courses').update({ published: !published }).eq('id', id)
  revalidateAll()
}
