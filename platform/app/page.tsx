import { redirect } from 'next/navigation'

type Props = { searchParams: Promise<{ code?: string }> }

export default async function Page({ searchParams }: Props) {
  const { code } = await searchParams
  if (code) {
    // Supabase が Site URL にコードを送ってきた場合、callback ルートに転送する
    redirect(`/auth/callback?code=${encodeURIComponent(code)}`)
  }
  redirect('/courses')
}
