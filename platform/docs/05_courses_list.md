# 05 受講者向け - 講座一覧ページ

`/courses` に公開済み講座の一覧を表示する。

---

## Todo

### ページ実装
- [x] `app/courses/page.tsx` を作成する（Server Component）
  - `published = true` の講座のみ取得する
  - `cache: 'no-store'` は不要（公開データのため適切な revalidate を設定）
- [x] 講座カードコンポーネント `components/CourseCard.tsx` を作成する
  - タイトル、サムネイル（`next/image` を使用）、説明文（省略表示）を表示
  - カードクリックで `/courses/[id]` へ遷移

### レイアウト
- [x] `app/courses/layout.tsx` を作成する（ヘッダー含む受講者共通レイアウト）
- [x] `app/courses/loading.tsx` を作成する（Suspense フォールバック）
- [x] `app/courses/error.tsx` を作成する（Error Boundary）

### 動作確認
- [ ] 公開済み講座のみ表示されることを確認する（`published = false` は非表示）
- [ ] 講座が0件のときに適切なメッセージを表示することを確認する
