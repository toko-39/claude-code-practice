# 02 Next.js プロジェクト設定・Supabase クライアント設定

Next.js プロジェクトに Supabase クライアントを組み込み、サーバー用・クライアント用の両方を整備する。

---

## Todo

### パッケージインストール
- [x] `@supabase/ssr` をインストールする（`npm install @supabase/ssr @supabase/supabase-js`）

### Supabase クライアント作成
- [x] `lib/supabase/server.ts` を作成する（Server Component / Server Action / Route Handler 用）
  - `createServerClient` を使い、`cookies()` から `getAll` / `setAll` を実装する
- [x] `lib/supabase/client.ts` を作成する（Client Component 用）
  - `createBrowserClient` を使いシングルトンで返す

### 型定義
- [x] Supabase CLI または `generate_typescript_types` で DB の型定義ファイルを生成する
- [x] 生成した型を `lib/supabase/types.ts` として配置し、クライアントに適用する

### 動作確認
- [ ] Server Component から Supabase に接続してデータ取得できることを確認する
- [ ] `.env.local` の環境変数が正しく読み込まれていることを確認する
