# 06 受講者向け - 講座詳細ページ

`/courses/[id]` に講座タイトル・説明・セクション一覧・動画リスト・視聴済みバッジを表示する。

---

## Todo

### ページ実装
- [x] `app/courses/[id]/page.tsx` を作成する（Server Component）
  - 講座情報、セクション、レッスンを一括取得する（N+1 を避けるため JOIN またはまとめてフェッチ）
  - ログインユーザーの `progress` を取得し、視聴済みレッスンを特定する
- [x] `app/courses/[id]/not-found.tsx` を作成する（存在しない ID アクセス時）
- [x] `app/courses/[id]/loading.tsx` を作成する
- [x] `generateMetadata` で講座タイトルをページタイトルに設定する

### UI コンポーネント
- [x] セクションアコーディオン（または展開リスト）コンポーネントを作成する
- [x] レッスン行に視聴済みバッジ（`completed = true` の場合）を表示する
- [x] レッスン行クリックで `/courses/[id]/lessons/[lessonId]` へ遷移する

### 動作確認
- [ ] セクション・レッスンが `order_index` 順に表示されることを確認する
- [ ] 視聴済みレッスンにバッジが表示されることを確認する
- [ ] 未ログイン状態でアクセスすると middleware により `/login` へリダイレクトされることを確認する
