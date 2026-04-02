# 10 管理者 - 動画（レッスン）管理

`/admin/courses/[id]/sections/[sectionId]/lessons` でレッスンの追加・編集・削除・並び替えを行う。

---

## Todo

### ページ実装
- [x] `app/admin/courses/[id]/sections/[sectionId]/lessons/page.tsx` を作成する（Server Component）
  - 対象セクションのレッスン一覧を `order_index` 順で表示する
  - 各行に YouTube ID・動画時間・「編集」「削除」ボタンを表示する
  - 「レッスン追加」フォームまたはボタンを配置する

### Server Actions
- [x] Server Action `actions/admin/lessons.ts` に以下を作成する
  - `createLesson(sectionId, formData)` — `lessons` テーブルに INSERT
  - `updateLesson(id, formData)` — タイトル・youtube_id・duration_sec を UPDATE
  - `deleteLesson(id)` — DELETE
  - `reorderLessons(ids: string[])` — 配列の順序で `order_index` を一括 UPDATE
  - 各 Action 後に `revalidatePath` を呼ぶ

### フォーム
- [x] 入力項目を実装する
  - タイトル（必須）
  - YouTube 動画 ID（必須）— URL から ID を抽出するヘルパーがあると便利
  - 動画時間（秒）（任意）

### 並び替え UI
- [x] レッスンの並び替えを実装する（ドラッグ＆ドロップ または 上下ボタン）
  - セクション管理（#09）と同じ方式に統一する

### 動作確認
- [ ] レッスンを追加すると動画プレイヤーページで再生できることを確認する
- [ ] `order_index` 順に前後ナビゲーションが正しく動作することを確認する（チケット #07 との結合確認）
- [ ] レッスン削除後に該当 `progress` レコードも削除されることを確認する（cascade）
