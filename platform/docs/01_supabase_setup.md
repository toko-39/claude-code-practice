# 01 Supabase セットアップ

Supabase プロジェクトの初期設定、テーブル作成、RLS ポリシー、Auth 設定を行う。

---

## Todo

### プロジェクト作成

- [x] Supabase で新規プロジェクトを作成する
- [x] `.env.local` に `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` を設定する

### テーブル作成（SQL エディタで実行）

- [x] `public.users` テーブルを作成する
  ```sql
  create table public.users (
    id uuid references auth.users(id) primary key,
    role text not null default 'user',
    created_at timestamptz default now()
  );
  ```
- [x] `public.courses` テーブルを作成する
  ```sql
  create table public.courses (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    thumbnail_url text,
    published boolean not null default false,
    created_at timestamptz default now()
  );
  ```
- [x] `public.sections` テーブルを作成する
  ```sql
  create table public.sections (
    id uuid primary key default gen_random_uuid(),
    course_id uuid references public.courses(id) on delete cascade,
    title text not null,
    order_index int not null default 0
  );
  ```
- [x] `public.lessons` テーブルを作成する
  ```sql
  create table public.lessons (
    id uuid primary key default gen_random_uuid(),
    section_id uuid references public.sections(id) on delete cascade,
    title text not null,
    youtube_id text not null,
    duration_sec int,
    order_index int not null default 0
  );
  ```
- [x] `public.progress` テーブルを作成する
  ```sql
  create table public.progress (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id) on delete cascade,
    lesson_id uuid references public.lessons(id) on delete cascade,
    completed boolean not null default false,
    completed_at timestamptz,
    unique(user_id, lesson_id)
  );
  ```

### RLS 設定

- [x] 全テーブルで RLS を有効化する
- [x] `courses` に `published read` ポリシーを設定する（`published = true` の行を全ユーザーが読める）
- [x] `courses` に `admin write` ポリシーを設定する（`role = 'admin'` のみ書き込み可）
- [x] `sections` に同様の `public read` / `admin write` ポリシーを設定する
- [x] `lessons` に同様の `public read` / `admin write` ポリシーを設定する
- [x] `progress` に `own progress` ポリシーを設定する（`user_id = auth.uid()` のみ読み書き可）
- [x] emailとfull_nameはauth.userからアクセスしてセキュリティ強化

### Auth 設定

- [ ] Supabase Auth のメール確認設定を確認・調整する
- [x] 新規登録時に `public.users` へ自動挿入するトリガー関数を作成する
- [ ] 自分のアカウントに `role = 'admin'` をダッシュボードから手動で付与する
