# デザイントークン対応表

テーマ本体の`dads-*`がこのプロジェクトのセマンティックトークンです。HA変数はそれを`var(--dads-...)`で参照します。モード別の色変更は`modes.light`／`modes.dark`で行い、RGB値も合わせて変更してください。

| トークン | ライト | ダーク | DADS色の根拠／用途 |
| --- | --- | --- | --- |
| `dads-background` | `#f2f2f2` | `#000000` | Gray-50 / Black、画面背景 |
| `dads-surface` | `#ffffff` | `#1a1a1a` | White / Gray-900、カード・サイドバー |
| `dads-surface-secondary` | `#f2f2f2` | `#333333` | Gray-50 / Gray-800、副次的な面 |
| `dads-surface-elevated` | `#ffffff` | `#333333` | White / Gray-800、ダイアログ |
| `dads-text` | `#1a1a1a` | `#f2f2f2` | Gray-900 / Gray-50、本文 |
| `dads-text-secondary` | `#666666` | `#cccccc` | Gray-600 / Gray-200、補助テキスト |
| `dads-text-disabled` | `#666666` | `#b3b3b3` | Gray-600 / Gray-300、無効時テキスト |
| `dads-border` | `#7f7f7f` | `#999999` | Gray-500 / Gray-400、識別に必要な境界 |
| `dads-primary` | `#0017c1` | `#9db7f9` | Blue-900 / Blue-300、操作・リンク |
| `dads-primary-hover` | `#00118f` | `#c5d7fb` | Blue-1000 / Blue-200 |
| `dads-primary-active` | `#000071` | `#d9e6ff` | Blue-1100 / Blue-100 |
| `dads-on-primary` | `#ffffff` | `#000060` | White / Blue-1200、塗りボタンの文字 |
| `dads-selected` | `#e8f1fe` | `#000060` | Blue-50 / Blue-1200、選択背景 |
| `dads-success` | `#115a36` | `#71c598` | Green-900 / Green-300 |
| `dads-warning` | `#ac3e00` | `#ffa66d` | Orange-900 / Orange-300 |
| `dads-error` | `#ce0000` | `#ff9696` | Red-900 / Red-300 |
| `dads-focus-yellow` | `#ffd43d` | 同じ | Yellow-300、フォーカス内側 |
| `dads-focus-black` | `#000000` | 同じ | Black、フォーカス外側 |

色値はDADS HTMLコードスニペットの[global.css](https://github.com/digital-go-jp/design-system-example-components-html/blob/af8b6656c8d864a22ef444d088e5568f3416f6aa/src/global.css)を参照しました。組み合わせとダーク時の役割は本テーマで設計したもので、公式のダークトークンではありません。

## Home Assistantへの割り当て

| 意味 | 主なHA変数 |
| --- | --- |
| 主要操作 | `primary-color`, `accent-color`, `ha-color-fill-primary-*`, `ha-color-on-primary-*` |
| 本文・補助情報 | `primary-text-color`, `secondary-text-color`, `ha-color-text-*` |
| 背景・カード | `primary-background-color`, `card-background-color`, `ha-card-background` |
| 枠線 | `divider-color`, `outline-color`, `ha-card-border-color`, `ha-color-border-neutral-*` |
| 通知・異常 | `success-color`, `warning-color`, `error-color`, `info-color` |
| ナビゲーション | `sidebar-*`, `app-header-*` |
| ダイアログ | `ha-dialog-surface-background`, `ha-dialog-border-radius`, `dialog-box-shadow` |
| 書体 | `ha-font-family-body`, `ha-font-family-heading`, `ha-font-family-longform`, `mdc-typography-font-family` |
| 大きさ・行高 | `ha-font-size-m`=16px×HAスケール, `ha-line-height-normal`=1.6 |
| 形状 | `ha-card-border-radius`, `ha-button-border-radius`, `ha-section-border-radius`=8px |
| 余白 | Sectionsの列間・行間24px、狭幅余白8px、タイル内部8px/16px |

HAの`state-*`、ドメイン／device_class別状態色、エネルギー色、グラフ系列色は上書きしません。ON/OFFやエラーの意味を保ち、色だけに頼らない標準の状態ラベルも残します。これらの標準色に対するコントラストは本テーマの静的チェック対象外です。

本文は16pxを基準としますが、補助テキストは14px、一部の小さな注記は12pxです。標準コンポーネント内の固定px指定は完全には変更できません。フォントスケールを固定しないのでHAの文字サイズ設定と併用できます。
