'use server'

import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/assert-admin'
import { revalidatePath } from 'next/cache'

function revalidate(courseId: string, sectionId: string) {
  revalidatePath(`/admin/courses/${courseId}/sections/${sectionId}/lessons`)
  revalidatePath(`/courses/${courseId}`)
}

export type LessonFormState = { error: string } | null

/** YouTube URL または ID から動画 ID を抽出する */
function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim()
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed
  const shortMatch = trimmed.match(/youtu\.be\/([\w-]{11})/)
  if (shortMatch) return shortMatch[1]
  const longMatch = trimmed.match(/[?&/]v[=/]([\w-]{11})/)
  if (longMatch) return longMatch[1]
  return null
}

export async function createLesson(
  sectionId: string,
  courseId: string,
  prevState: LessonFormState,
  formData: FormData
): Promise<LessonFormState> {
  await assertAdmin()

  const title = (formData.get('title') as string).trim()
  const youtubeRaw = (formData.get('youtube_id') as string).trim()
  const durationRaw = formData.get('duration_sec') as string

  if (!title) return { error: 'タイトルは必須です' }
  if (title.length > 200) return { error: 'タイトルは200文字以内で入力してください' }

  const youtubeId = extractYoutubeId(youtubeRaw)
  if (!youtubeId) return { error: '有効な YouTube URL または動画 ID を入力してください' }

  const durationSec = durationRaw ? parseInt(durationRaw, 10) : null
  if (durationRaw && (isNaN(durationSec!) || durationSec! < 0 || durationSec! > 86400)) {
    return { error: '動画時間は 0〜86400 秒の範囲で入力してください' }
  }

  const supabase = await createClient()

  const { data: last } = await supabase
    .from('lessons')
    .select('order_index')
    .eq('section_id', sectionId)
    .order('order_index', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { error } = await supabase.from('lessons').insert({
    section_id: sectionId,
    title,
    youtube_id: youtubeId,
    duration_sec: durationSec,
    order_index: (last?.order_index ?? -1) + 1,
  })

  if (error) return { error: 'データの保存に失敗しました' }

  revalidate(courseId, sectionId)
  return null
}

export async function updateLesson(
  id: string,
  courseId: string,
  sectionId: string,
  formData: FormData
): Promise<LessonFormState> {
  await assertAdmin()

  const title = (formData.get('title') as string).trim()
  const youtubeRaw = (formData.get('youtube_id') as string).trim()
  const durationRaw = formData.get('duration_sec') as string

  if (!title) return { error: 'タイトルは必須です' }
  if (title.length > 200) return { error: 'タイトルは200文字以内で入力してください' }

  const youtubeId = extractYoutubeId(youtubeRaw)
  if (!youtubeId) return { error: '有効な YouTube URL または動画 ID を入力してください' }

  const durationSec = durationRaw ? parseInt(durationRaw, 10) : null
  if (durationRaw && (isNaN(durationSec!) || durationSec! < 0 || durationSec! > 86400)) {
    return { error: '動画時間は 0〜86400 秒の範囲で入力してください' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('lessons')
    .update({ title, youtube_id: youtubeId, duration_sec: durationSec })
    .eq('id', id)

  if (error) return { error: 'データの更新に失敗しました' }

  revalidate(courseId, sectionId)
  return null
}

export async function deleteLesson(id: string, courseId: string, sectionId: string) {
  await assertAdmin()
  const supabase = await createClient()
  await supabase.from('lessons').delete().eq('id', id)
  revalidate(courseId, sectionId)
}

export async function reorderLessons(courseId: string, sectionId: string, ids: string[]) {
  await assertAdmin()
  const supabase = await createClient()
  await Promise.all(
    ids.map((id, index) =>
      supabase.from('lessons').update({ order_index: index }).eq('id', id)
    )
  )
  revalidate(courseId, sectionId)
}
