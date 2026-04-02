# 09 管理者 - セクション管理

`/admin/courses/[id]/sections` でセクションの追加・編集・削除・並び替えを行う。

---

## Todo

### ページ実装
- [x] `app/admin/courses/[id]/sections/page.tsx` を作成する（Server Component）
  - 対象講座のセクション一覧を `order_index` 順で表示する
  - 各行に「編集」「削除」ボタンを配置する
  - 「セクション追加」フォームまたはボタンを配置する

### Server Actions
- [x] Server Action `actions/admin/sections.ts` に以下を作成する
  - `createSection(courseId, formData)` — `sections` テーブルに INSERT（`order_index` は末尾）
  - `updateSection(id, formData)` — タイトルを UPDATE
  - `deleteSection(id)` — DELETE（cascade で lessons も削除）
  - `reorderSections(ids: string[])` — 配列の順序で `order_index` を一括 UPDATE
  - 各 Action 後に `revalidatePath` を呼ぶ

### 並び替え UI
- [x] セクションの並び替えを実装する（上下ボタン）
  - Client Component として実装し、完了時に Server Action を呼ぶ

### 動作確認
- [ ] セクションを追加すると `order_index` が末尾に付与されることを確認する
- [ ] 並び替えが `order_index` に反映されることを確認する
- [ ] セクション削除で配下のレッスンも削除されることを確認する（cascade）
