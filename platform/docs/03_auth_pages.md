# 03 認証ページ（ログイン・新規登録）

メールアドレス＋パスワードによる新規登録・ログイン・ログアウト機能を実装する。

---

## Todo

### ページ作成
- [x] `app/(auth)/login/page.tsx` を作成する
  - メールアドレス・パスワードの入力フォーム
  - Server Action でログイン処理（`supabase.auth.signInWithPassword`）
  - ログイン成功後は `/courses` へリダイレクト
- [x] `app/(auth)/signup/page.tsx` を作成する
  - メールアドレス・パスワードの入力フォーム
  - Server Action で新規登録処理（`supabase.auth.signUp`）
  - 登録成功後はメール確認を案内するか `/courses` へリダイレクト

### ログアウト
- [x] ログアウト用の Server Action を `actions/auth.ts` に作成する（`supabase.auth.signOut`）
- [x] ヘッダーコンポーネントにログアウトボタンを設置する

### レイアウト
- [x] `app/(auth)/layout.tsx` を作成する（認証ページ共通レイアウト）

### バリデーション・エラー表示
- [x] フォームのバリデーションエラーをページ上に表示する
- [x] Supabase Auth のエラーメッセージ（メール未確認・パスワード不正など）をユーザーに表示する
