# 04 ミドルウェア（ルート保護）

`middleware.ts` でログイン必須ルートと管理者専用ルートを保護する。

---

## Todo

### middleware.ts 実装
- [x] `middleware.ts` をプロジェクトルートに作成する
- [x] `createServerClient` でリクエストごとに Supabase クライアントを生成する
  - `getAll` / `setAll` で cookies を適切に受け渡す
- [x] `supabase.auth.getClaims()` を必ず呼び、トークンを更新する（`getSession()` は使わない）
- [x] 未ログインユーザーが `/courses/**` または `/admin/**` にアクセスした場合、`/login` へリダイレクトする
- [x] `role != 'admin'` のユーザーが `/admin/**` にアクセスした場合、`/courses` へリダイレクトする
- [x] `matcher` を設定し、静的ファイル（`/_next/**`, `/favicon.ico` 等）はミドルウェアをスキップする

### ルートリダイレクト
- [x] `/` にアクセスしたユーザーを `/courses` へリダイレクトする（`app/page.tsx` または middleware で処理）

### 動作確認
- [ ] 未ログイン状態で `/courses` にアクセスすると `/login` にリダイレクトされることを確認する
- [ ] `user` ロールで `/admin` にアクセスすると `/courses` にリダイレクトされることを確認する
- [ ] `admin` ロールで `/admin` にアクセスできることを確認する
