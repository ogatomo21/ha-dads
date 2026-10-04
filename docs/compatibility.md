# 対応範囲と互換性

基準: Core 2026.9.4 / Frontend 20260826.7 / card-mod 4.2.1。以下はソースと仕様の照合結果です。実HAでの表示確認はまだ行っていません。

基本の配色・カード形状はHACSでテーマを導入するだけで使用できます。以下の`card-mod-*`による補正は、任意の[card-mod追加設定](card-mod.md)を行った場合の対応です。

書体には[Google FontsのURL](fonts.md)を管理画面のリソースへStylesheetとして一度登録します。専用JSやフォント用のYAML編集は不要です。リソースはダッシュボードを開いたときに読み込まれます。

| 対象 | 適用方法 | 制約／受入確認 |
| --- | --- | --- |
| 標準UI全体の配色・本文書体 | 標準テーマ変数、`ha-color-text-*`、`ha-font-*` | 固定色や独自CSSを持つ画面では反映されない場合がある |
| ha-cardを持つ標準カード | 標準変数＋`card-mod-card-yaml` | 埋め込みや他テーマの明示指定に注意 |
| タイル | `ha-tile-info$`のslotted文字を折り返し、`ha-tile-container$`の余白補正 | 付属例は全幅＋行数auto。既存の固定行カードは高さ不足になり得る |
| サイドバー | `card-mod-sidebar-yaml`、現行`ha-list-item-button`を対象 | 折り畳み・狭幅・メニュー操作の表示確認が必要 |
| Lovelaceヘッダー | `card-mod-root`で`.header`を補正 | タブ内部の全ボタンのフォーカスを置換するものではない |
| 設定画面 | `card-mod-config`と`card-mod-top-app-bar-fixed` | 配色・書体・上部バー中心。内部各設定コンポーネントの全面再設計はしない |
| 詳細ダイアログ | `card-mod-more-info`＋`ha-dialog`変数、`wa-dialog::part(dialog)` | 実HAで境界・背景・閉じる操作・フォーカスの確認が必要 |
| 通常ダイアログ | `card-mod-dialog`、現行ha-dialogのwa-dialogを対象 | ha-md-dialog等の別実装の内部枠線は対応保証外 |
| キーボードフォーカス | カード内の直接操作、リンク、タイル操作、サイドバー、WAのリング変数 | 全Shadow DOMへ再帰的に注入しない。対象外は標準フォーカスを維持 |
| 機器アイコン | 内蔵MDI | Google Material Symbolsへの自動変換はしない |
| 既存カスタムカード | 共有テーマ変数が使われる範囲 | Mushroom等の個別対応は今回の対象外 |
| ログイン・オンボーディング・iframe | 適用を保証しない | 認証前・別documentはテーマの適用条件が異なる |

## 実装上の判断

- カード、メニュー、本文の寸法を広範囲に固定しません。HAが持つ狭幅判定・safe area・ダイアログの全画面化を維持します。
- `card-mod-more-info`と`card-mod-dialog`はha-dialogのShadow RootにCSSを注入するため、現行の`wa-dialog::part(dialog)`を直接指定します。旧MDC用のセレクターだけを使う構成にはしていません。
- 対象のcard-modは`hui-card`の実カード要素にCSSを適用します。このためタイル内部は`ha-tile-info$`／`ha-tile-container$`から辿ります。
- サイドバーの`focus-within`補正は内部のフォーカスにも届きます。マウス操作時にも表示されることがあります。
- `wa-focus-ring`は黒いリングを指定します。黄色との二重表示は補正対象のCSSで追加します。対象外のWA内部コンポーネントは黒い標準リングとなる場合があります。
- テーマYAMLはHAの正式なテーマ形式です。配色以外の変数やDOM構造はHAの安定した公開APIとは限らず、更新時の受入確認が必要です。
- iOS 15 / Android 9専用の新しいブラウザー機能を追加しませんが、動作可能なブラウザー／WebViewの下限は使用するHAとcard-modにも依存します。実端末での確認は未実施です。

## 参照したソース

- [Core 2026.9.4のFrontend依存](https://github.com/home-assistant/core/blob/2026.9.4/homeassistant/package_constraints.txt)
- [HAテーマ仕様](https://www.home-assistant.io/integrations/frontend/)
- [Frontend 20260826.7: ha-card](https://github.com/home-assistant/frontend/blob/20260826.7/src/components/ha-card.ts)
- [同: タイル文字](https://github.com/home-assistant/frontend/blob/20260826.7/src/components/tile/ha-tile-info.ts)
- [同: ha-dialog](https://github.com/home-assistant/frontend/blob/20260826.7/src/components/ha-dialog.ts)
- [同: Sections](https://github.com/home-assistant/frontend/blob/20260826.7/src/panels/lovelace/views/hui-sections-view.ts)
- [card-mod 4.2.1の適用処理](https://github.com/thomasloven/lovelace-card-mod/tree/v4.2.1/src/patch)
- [card-modテーマ仕様](https://github.com/thomasloven/lovelace-card-mod/blob/v4.2.1/README-themes.md)
