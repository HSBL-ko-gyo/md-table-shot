# MD Table Shot

Markdownのテーブルを、noteやブログへ貼り付けやすいPNG画像に変換する静的Webツールです。入力・解析・画像生成はすべてブラウザ内で行い、Markdownを外部サーバーへ送信しません。

## 主な機能

- GFM形式のMarkdown tableをリアルタイムプレビュー
- 左寄せ（`:---`）、中央寄せ（`:---:`）、右寄せ（`---:`）
- セル内の太字、斜体、取り消し線、インラインコード、リンク
- PNGのクリップボードコピーとダウンロード
- 1x / 2x / 3x出力、白背景 / 透過背景
- 表示テーマと画像テーマを個別に指定
- 文字サイズ、セル余白、表の最大幅を調整
- 入力内容と設定を`localStorage`へ自動保存
- スマートフォン対応

## ローカル起動

Node.js 22以降を推奨します。

```bash
npm install
npm run dev
```

Viteが表示するURL（通常は `http://localhost:5173`）を開いてください。

## テストとビルド

```bash
npm test
npm run lint
npm run build
npm run preview
```

`vite.config.ts` の `base` は `./` にしているため、GitHub Pagesのリポジトリ配下でもアセットパスが壊れません。

## GitHub Pagesへのデプロイ

1. GitHubリポジトリの **Settings → Pages → Build and deployment** で **Source: GitHub Actions** を選びます。
2. `main` ブランチへpushします。
3. `.github/workflows/deploy.yml` がテストとビルドを行い、`dist` をGitHub Pagesへ公開します。

## 対応範囲と構造

初版はMarkdown tableに集中しています。表解析は `src/features/table`、PNG生成は `src/features/export` に分離しているため、将来は同じプレビュー・出力基盤へコードブロックや引用のレンダラーを追加できます。

画像のクリップボードコピーには、`ClipboardItem` とSecure Context（HTTPSまたはlocalhost）に対応したブラウザが必要です。非対応ブラウザでは「PNGを保存」を利用できます。

## 名前の候補

正式な仮称は **MD Table Shot** です。より短い候補として **Table Shot**、用途が伝わりやすい候補として **Markdown Table PNG** も考えられます。

## License

MIT
