# 出典・第三者ライセンス

## デジタル庁デザインシステム

出典: https://design.digital.go.jp/dads/ （v2.18.0）

デジタル庁デザインシステムウェブサイトの内容を基にTomoya OgawaがHome Assistant向けに加工して作成しました。デジタル庁が作成・認定したテーマではありません。ダーク配色は本プロジェクト独自の拡張です。

利用上の注意事項: https://design.digital.go.jp/dads/introduction/notices/

色値およびフォーカスの組み合わせはHTML版コードスニペットを参照しています。

- Repository: https://github.com/digital-go-jp/design-system-example-components-html
- Reference commit: `af8b6656c8d864a22ef444d088e5568f3416f6aa`
- File: `src/global.css`
- License: MIT。以下は参照元のライセンス全文です。

```text
MIT License

Copyright (c) 2025 デジタル庁

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 実行時の外部依存

Noto Sans JPはGoogle Fontsから実行時に読み込みます。フォントデータはこのプロジェクトに同梱しません。フォント本体は本プロジェクトのMIT Licenseの対象外です。

- Font: Noto Sans JP
- Source: https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap
- Upstream: https://github.com/google/fonts/tree/main/ofl/notosansjp
- License: [SIL Open Font License 1.1](https://github.com/google/fonts/blob/main/ofl/notosansjp/OFL.txt)

Google FontsのCSSをStylesheetリソースとして登録します。CSSはfonts.googleapis.com、フォント本体はfonts.gstatic.comから読み込みます。専用JSやフォントデータの同梱はありません。[設定方法](docs/fonts.md)

card-modは利用者が別途HACSから導入します。このプロジェクトにはcard-mod本体を再配布していません。

- https://github.com/thomasloven/lovelace-card-mod
- MIT License。導入する版に含まれるライセンスを参照してください。

MDIはHome Assistant内蔵のものを利用し、アイコンデータやWebフォントをこのプロジェクトには同梱していません。

## 開発用依存

`yaml`（ISC）および`postcss`（MIT）はYAML/CSSの検証にのみ使用します。テーマYAMLの導入には不要です。版は`package-lock.json`で固定し、依存パッケージのLICENSEは各パッケージ内に含まれます。
