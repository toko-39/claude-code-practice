# 07 受講者向け - 動画プレイヤー・進捗記録

`/courses/[id]/lessons/[lessonId]` で YouTube 埋め込み再生と視聴進捗の記録を行う。

---

## Todo

### ページ実装
- [x] `app/courses/[id]/lessons/[lessonId]/page.tsx` を作成する（Server Component）
  - レッスン情報（`youtube_id`、タイトル等）を取得する
  - 同セクション・同コース内の前後レッスンを取得する
- [x] `app/courses/[id]/lessons/[lessonId]/not-found.tsx` を作成する
- [x] `generateMetadata` でレッスンタイトルをページタイトルに設定する

### YouTube 埋め込みプレイヤー
- [x] `components/YoutubePlayer.tsx` を作成する（Client Component）
  - `youtube_id` を使って `https://www.youtube.com/embed/{youtube_id}` を iframe で埋め込む
  - `allowFullScreen` など適切な属性を設定する

### 視聴進捗記録
- [x] 「視聴済みにする」ボタンを作成する（Client Component）
- [x] Server Action `actions/progress.ts` に `markAsCompleted(lessonId)` を作成する
  - `progress` テーブルに `upsert`（`unique(user_id, lesson_id)` を利用）
  - 完了後に `revalidatePath` で講座詳細ページのキャッシュを更新する
- [x] 既に視聴済みの場合はボタンを「視聴済み」表示に変える

### ナビゲーション
- [x] 前の動画・次の動画へのリンクボタンを表示する
- [x] 講座詳細ページへ戻るリンクを表示する

### 動作確認
- [ ] 「視聴済みにする」を押すと `progress` テーブルに記録されることを確認する
- [ ] 講座詳細ページに戻ると視聴済みバッジが反映されていることを確認する
- [ ] 前後ナビゲーションが正しいレッスンを指していることを確認する
