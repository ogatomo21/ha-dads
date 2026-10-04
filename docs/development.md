# 開発・ローカル確認

Node.js 22以上を使用します。HAへのテーマ導入にnpmは不要です。

Noto Sans JPはプレビューでもcss/dads-fonts.cssからGoogle Fontsを読み込みます。HAのbodyのRoboto直接指定を再現し、実際のbody・home-assistantのfont-familyも検証します。ブラウザー検証にはGoogle Fontsへ通信できる環境が必要です。静的検証と単体テストはネットワーク不要です。

```powershell
Set-Location 'C:\ogatomo\codex_temp\ha-dads'
npm.cmd ci --ignore-scripts
npm.cmd run check
npm.cmd test
npm.cmd run preview
```

プレビューは`http://127.0.0.1:4173/`です。停止は`Ctrl+C`。配色・文字サイズ・ON/OFFの切り替え、警告・利用不可表示を確認できます。配色とカード用CSSはテーマYAMLから生成して読み込みます。

**プレビューは実HAではありません**。カード・レイアウトを近似したHTMLで、card-mod自体やHAのShadow DOM内の適用結果は検証しません。文字200%はHAのフォントスケールを模したものであり、実HAではブラウザー200%ズームも別途確認します。

ブラウザー検証を再実行する場合は、プレビューを起動したまま別のPowerShellで以下を実行します。`@playwright/cli`は開発用ツールで、テーマの依存ではありません。

```powershell
Set-Location 'C:\ogatomo\codex_temp\ha-dads'
npx.cmd --yes --package @playwright/cli playwright-cli -s=ha-dads open http://127.0.0.1:4173
npx.cmd --yes --package @playwright/cli playwright-cli -s=ha-dads snapshot
New-Item -ItemType Directory -Path output/playwright -Force | Out-Null
npx.cmd --yes --package @playwright/cli playwright-cli -s=ha-dads --raw run-code --filename scripts/browser-check.js | Set-Content -Encoding utf8 output/playwright/results.json
npx.cmd --yes --package @playwright/cli playwright-cli -s=ha-dads close
```

結果とスクリーンショットは`output/playwright/`へ出力します。`npm run check`はHACSマニフェスト・テーマファイル構成・検証CIに加え、YAML・埋め込みYAMLの重複キー、CSS構文、変数の欠落・循環、RGBとの整合性、配色のコントラストを確認します。HAの設定includeを展開したり、HA全体のコントラストを測定したりするものではありません。公開先のメタデータはGitHub上のHACS Actionで確認します。

詳細: [トークン対応表](tokens.md) / [対応範囲](compatibility.md) / [検証結果と実HAの受入手順](verification.md)


