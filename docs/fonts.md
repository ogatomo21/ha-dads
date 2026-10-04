# Noto Sans JPを画面から設定する

Google FontsのURLをStylesheetリソースとして一度登録します。専用JS、フォントファイルのコピー、フォント用のYAML編集、HA再起動は不要です。テーマの本文・見出し・ボタンの指定はNoto Sans JPに統一しています。

## 初回だけ行う設定

1. [ダッシュボードのリソースを開く](https://my.home-assistant.io/redirect/lovelace_resources/)。直接開く場合は **設定 → ダッシュボード → ⋮ → リソース** です。項目がない場合はプロフィールで詳細モードを有効にしてください。登録には管理者権限が必要です。
2. **リソースを追加**を押し、次のURLを貼ります。
3. 種類は **Stylesheet（スタイルシート）** を選択して保存します。JavaScript Moduleではありません。
4. ブラウザーを強制再読み込みして、一度ダッシュボードを開きます。プロフィールのテーマを **DADS** にします。

```text
https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap
```

このリソース登録はHA全体で共有するため、各端末・各カードで同じ設定をする必要はありません。各ブラウザーは再読み込みしてダッシュボードを開きます。CSSはfonts.googleapis.com、フォント本体はfonts.gstatic.comから読み込みます。ウェイト100〜900、display=swapを指定しています。[Google Fonts CSS API](https://developers.google.com/fonts/docs/css2)

## 適用範囲

ダッシュボードで読み込んだスタイルシートはdocumentのheadへ登録され、同じ画面セッションのサイドバー・設定画面・詳細ダイアログのShadow DOMからも参照できます。DADSのフォント変数を利用する標準コンポーネントに適用されます。

リソースはダッシュボードを開いたときに読み込まれます。新しいタブや再読み込み後に設定画面へ直接アクセスした場合は、一度ダッシュボードを開いてください。別documentのアドオン／iframe、ログイン画面、独自フォントを持つカスタムカードやコード用等幅文字の書体は対象外です。テーマYAMLだけで外部フォントを自動登録する仕組みはありません。

参考の[Material You Theme](https://github.com/Nerwyn/material-you-theme#optional-google-sans-flex-font-installation)もGoogle FontsをStylesheetリソースとして登録します。HAの登録方法は[公式ドキュメント](https://developers.home-assistant.io/docs/frontend/custom-ui/registering-resources/)を参照してください。

## 以前のモジュール版から移行する場合

先に上記のStylesheetリソースを登録します。その後、configuration.yamlをバックアップし、frontend.extra_module_urlからha-dadsのnoto-sans-jp.jsだけを除いて設定チェック後にHAを再起動します。card-modなど他のURLは残してください。以後、フォントのためにYAMLを編集する必要はありません。

## 確認・復帰

NetworkでGoogle FontsのCSSとWOFF2の取得、ChromeのElements → Computed → Rendered FontsでNoto Sans JPを確認します。読み込み中・通信失敗・未収録文字には代替書体を使います。

標準テーマに戻すとDADSの書体指定も解除されます。フォント読み込み自体を止める場合は、リソース画面から追加したGoogle Fontsの項目を削除し、ブラウザーを再読み込みします。
