# jinji-jidoka-lab

「ジンジの自動化ラボ」のホームページ（1ページ完結の静的サイト）。

- 公開URL（予定）：https://syutojpc918.github.io/jinji-jidoka-lab/
- 設計の正本：[BRIEF.md](BRIEF.md)
- 自己レビュー記録：[REVIEW.md](REVIEW.md)

## 構成

```
index.html            ページ本体（文案はBRIEF.md第5節のまま）
css/style.css         デザイン（色・文字組み・レイアウト・動き）
js/main.js            スクロール連動の動き（依存なし・約60行）
assets/favicon.svg    ファビコン
assets/apple-touch-icon.png
assets/ogp.png        OGP画像（1200×630）
.nojekyll             GitHub PagesでJekyll処理を無効化
```

ビルドは不要です。`index.html` をブラウザで開けばそのまま確認できます。

## GitHub Pages での公開手順

1. リポジトリを公開（Public）にする
2. Settings → Pages → Build and deployment
3. Source を「Deploy from a branch」、Branch を `main` / `/ (root)` にして Save
4. 数分後に https://syutojpc918.github.io/jinji-jidoka-lab/ で表示される

## 文面を直すとき

- 先に BRIEF.md を直し、そのあと index.html に反映する（BRIEF.mdが正本）
- 匿名化ルール（BRIEF.md 第4節）を必ず守る
- URLを独自ドメインに変える場合は、index.html の `canonical` / `og:url` / `og:image` の3か所も書き換える
