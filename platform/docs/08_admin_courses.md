# 08 管理者 - 講座管理 CRUD

`/admin/courses` で講座の一覧表示・作成・編集・削除・公開切り替えを行う。

---

## Todo

### レイアウト
- [x] `app/admin/layout.tsx` を作成する（管理者共通レイアウト・ナビゲーション）

### 講座一覧ページ
- [x] `app/admin/courses/page.tsx` を作成する（Server Component）
  - 全講座（`published` 問わず）を一覧表示する
  - 公開/非公開ステータスをバッジで表示する
  - 各行に「編集」「削除」ボタンを配置する
  - 「新規作成」ボタンを配置する

### 講座作成・編集
- [x] `app/admin/courses/new/page.tsx` を作成する（新規作成フォーム）
- [x] `app/admin/courses/[id]/page.tsx` を作成する（編集フォーム）
  - 入力項目：タイトル、説明文、サムネイル URL、公開フラグ
- [x] Server Action `actions/admin/courses.ts` に以下を作成する
  - `createCourse(formData)` — `courses` テーブルに INSERT
  - `updateCourse(id, formData)` — `courses` テーブルを UPDATE
  - `deleteCourse(id)` — `courses` テーブルから DELETE（cascade で sections・lessons も削除）
  - `togglePublished(id, published)` — `published` フラグを切り替え
  - 各 Action 後に `revalidatePath('/admin/courses')` を呼ぶ

### 動作確認
- [ ] 講座を作成すると一覧に表示されることを確認する
- [ ] 公開フラグを ON にすると受講者の `/courses` に表示されることを確認する
- [ ] 削除すると関連セクション・レッスンも削除されることを確認する（cascade）
- [ ] `admin` 以外のロールでアクセスすると middleware によりリダイレクトされることを確認する
