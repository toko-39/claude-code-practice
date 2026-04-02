# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 重要: Next.js ドキュメントを先に読むこと

このプロジェクトは **Next.js 16.2.2** を使用しており、以前のバージョンから破壊的変更が含まれています。Next.js に関するコードを書く前に、必ずローカルドキュメントを参照してください：

```
node_modules/next/dist/docs/
```

非推奨通知に注意し、学習データと API や規約が一致すると仮定しないこと。

---

## プロジェクト概要

**Udemy 風動画講座プラットフォーム（MVP）**

自作の YouTube 動画を講座形式で提供するプラットフォーム。将来的な課金機能追加を前提に設計する。

### 技術スタック

- **フロントエンド**: Next.js 16（App Router）/ React 19 / TypeScript 5
- **スタイリング**: Tailwind CSS v4（PostCSS経由）
- **バックエンド / DB**: Supabase（PostgreSQL + Auth）
- **デプロイ**: Vercel
- **動画ホスティング**: YouTube（限定公開 URL を iframe 埋め込み）

---

## コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバー起動
npm run lint     # ESLint 実行
```

単一ファイルの lint:
```bash
npx eslint <file>
```

---

## アーキテクチャ

### ディレクトリ構成方針

- `app/` — App Router のページ・レイアウト
- `app/(auth)/` — ログイン・新規登録ページ
- `app/courses/` — 受講者向けページ
- `app/admin/` — 管理者専用ページ（`role = 'admin'` のみアクセス可）
- `lib/supabase/` — Supabase クライアント（サーバー用・クライアント用）
- `middleware.ts` — ルート保護（認証必須・管理者専用）

### ユーザーロール

| ロール | 説明 |
|--------|------|
| `user` | 講座の閲覧・視聴進捗管理 |
| `admin` | 講座・セクション・動画の CRUD |

`admin` ロールの付与は Supabase ダッシュボードから手動で行う（MVP では管理者は1人）。

### ページ構成

```
/                                                  /courses へリダイレクト
/login                                             ログインページ
/signup                                            新規登録ページ
/courses                                           講座一覧（published=true のみ）
/courses/[id]                                      講座詳細（セクション・動画リスト・視聴済みバッジ）
/courses/[id]/lessons/[lessonId]                   動画プレイヤー（YouTube iframe・進捗記録）

/admin                                             管理者トップ
/admin/courses                                     講座一覧・作成
/admin/courses/[id]                                講座編集
/admin/courses/[id]/sections                       セクション管理
/admin/courses/[id]/sections/[sectionId]/lessons   動画管理
```

### ルート保護（middleware.ts）

- `/courses/**`, `/admin/**` — 未ログインユーザーは `/login` へリダイレクト
- `/admin/**` — `role != 'admin'` のユーザーは `/courses` へリダイレクト

### データベーススキーマ

```sql
-- Supabase Auth の auth.users を拡張
public.users       (id, email, role, created_at)
public.courses     (id, title, description, thumbnail_url, published, created_at)
public.sections    (id, course_id, title, order_index)
public.lessons     (id, section_id, title, youtube_id, duration_sec, order_index)
public.progress    (id, user_id, lesson_id, completed, completed_at)  -- unique(user_id, lesson_id)
```

### RLS（Row Level Security）方針

- `courses` / `sections` / `lessons`: 全ユーザーが `published = true` の講座を読める。書き込みは `admin` のみ。
- `progress`: `user_id = auth.uid()` の行のみ読み書き可。

### TypeScript

- strict モード有効
- パスエイリアス `@/*` → プロジェクトルート

---

## Next.js ベストプラクティス

### Server Components / Client Components

- **デフォルトは Server Component**。`'use client'` は必要な場合のみ付与する。
- `'use client'` が必要なケース: `useState` / `useEffect` などのフック使用、ブラウザ API 使用、イベントハンドラ（`onClick` 等）の直接バインド。
- インタラクティブな部分だけを切り出して Client Component にし、ツリー全体を Client にしない。
- Server Component から Client Component へは **シリアライズ可能な props のみ**渡せる（関数・クラスインスタンス不可）。

### データ取得

- データ取得は Server Component 内で行う（`async/await` で直接 `fetch` または Supabase クライアント呼び出し）。
- クライアント側でのデータ取得（`useEffect` + `fetch`）は避ける。必要な場合は Server Action か Route Handler を使う。
- N+1 クエリを避けるため、関連データは JOIN またはまとめてフェッチする。

### Server Actions

- フォーム送信・データ変更には Server Actions（`'use server'`）を使う。
- Server Action は `actions/` ディレクトリにまとめ、ページファイルに直書きしない。
- 変更後は `revalidatePath` / `revalidateTag` でキャッシュを更新する。

### キャッシュ・再検証

- `fetch` のキャッシュ戦略（`cache: 'no-store'` / `next: { revalidate: N }`）を意識して設定する。
- 動的データ（進捗、管理者操作後）は適切に `revalidatePath` を呼ぶ。

### エラー・ローディング

- 各ルートセグメントに `loading.tsx`（Suspense フォールバック）と `error.tsx`（Error Boundary）を配置する。
- `not-found.tsx` で 404 ページを定義する。

### 画像・フォント

- 画像は `next/image` を使う（`<img>` タグは使わない）。
- フォントは `next/font` で読み込み、`className` または CSS 変数で適用する。

### メタデータ

- 各ページの SEO は `export const metadata` または `generateMetadata` 関数で定義する。`<Head>` コンポーネントは使わない。

---

## Supabase Auth ルール（Next.js App Router）

### 環境変数

`.env.local` に以下を設定する：

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

- キーは新形式の `sb_publishable_xxx` を優先して使用する。
- `service_role` キーはサーバー専用。クライアントコードに含めてはいけない。

### クライアントの使い分け

| 用途 | 関数 |
|------|------|
| Server Component / Server Action / Route Handler | `createServerClient` |
| Client Component（ブラウザ） | `createBrowserClient` |

- `createBrowserClient` はシングルトンなので複数回呼び出してもインスタンスは1つ。
- `createServerClient` は**リクエストごとに新規生成**する。各リクエストの cookies から生成すること。

### middleware.ts での必須処理

Server Component は cookies に書き込めないため、`middleware.ts` で必ずトークン更新処理を行う：

```ts
// middleware.ts の骨格
const supabase = createServerClient(url, key, {
  cookies: {
    getAll: () => request.cookies.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach(({ name, value, options }) => {
        request.cookies.set(name, value)
        response.cookies.set(name, value, options)
      })
    },
  },
})

await supabase.auth.getClaims() // トークン更新のために必ず呼ぶ
```

### 認証状態の取得

- **`getSession()` をサーバーコードで信頼してはいけない。** JWT の再検証が保証されないため。
- **サーバー側では必ず `getClaims()` を使う。** プロジェクトの公開鍵で JWT 署名を毎回検証するため安全。

### ISR / CDN キャッシュの禁止

認証済みレスポンスをキャッシュすると、別ユーザーに他ユーザーのセッションが渡るリスクがある。ユーザー固有のデータを返すページ・Route Handler には `cache: 'no-store'` を設定し、CDN キャッシュを無効にすること。

---

## 注意事項

- YouTube 限定公開動画は URL を知っている人なら誰でも視聴可能。完全な閲覧制限はできないため、将来的に Vimeo への移行を検討すること。
- Supabase クライアントはサーバーコンポーネント用（`createServerClient`）とクライアントコンポーネント用（`createBrowserClient`）を使い分けること。

---

## MVP スコープ外（将来対応）

課金機能（Stripe）、コース購入・アクセス制御、レビュー・評価、動画の自前ホスティング、受講証明書、検索・フィルタ