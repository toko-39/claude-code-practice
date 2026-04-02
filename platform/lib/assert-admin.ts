'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * 現在のユーザーが admin ロールを持つか検証する。
 * admin でなければ例外を投げる。
 * Server Actions の冒頭で呼び出すこと。
 */
export async function assertAdmin(): Promise<void> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims?.sub) throw new Error('Unauthorized: ログインが必要です')

  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.claims.sub)
    .single()

  if (user?.role !== 'admin') throw new Error('Forbidden: 管理者権限が必要です')
}
