# Noto Sans JPを画面から設定する

DADSのフォント用CSSをStylesheetリソースとして一度登録します。Google Fontsを読み込み、HAがRobotoを直接指定するbody・アプリ上位のフォント継承も補正します。専用JS、フォントファイルのコピー、フォント用のYAML編集、HA再起動は不要です。

## 初回だけ行う設定

1. [ダッシュボードのリソース](https://my.home-assistant.io/redirect/lovelace_resources/)を開きます。直接開く場合は **設定 → ダッシュボード → ⋮ → リソース**。項目がない場合はプロフィールで詳細モードを有効にします。管理者権限が必要です。
2. **リソースを追加**を押し、次のURLを貼ります。以前Google FontsのURLを登録した場合は、その項目を編集して置き換えます。
3. 種類は **Stylesheet（スタイルシート）** を選択して保存します。JavaScript Moduleではありません。
4. テーマも更新し、ブラウザーを強制再読み込みして一度ダッシュボードを開きます。プロフィールのテーマを **DADS** にします。

```text
https://cdn.jsdelivr.net/gh/ogatomo21/ha-dads@main/css/dads-fonts.css
```

この変更をGitHubへpushした後に利用できるURLです。公開済みのReleaseタグにmainを置き換えると版を固定できます。push前に試す場合はcss/dads-fonts.cssだけをHAの/config/www/ha-dads/dads-fonts.cssへコピーし、リソースURLを/local/ha-dads/dads-fonts.cssにします。初めてwwwを作った場合のみHAの再起動が必要です。

登録はHA全体で共有するため、各端末・各カードで同じ設定をする必要はありません。各ブラウザーは再読み込みしてダッシュボードを開きます。Google FontsのCSSはfonts.googleapis.com、フォント本体はfonts.gstatic.comから取得します。ウェイト100〜900、display=swapを指定しています。[Google Fonts CSS API](https://developers.google.com/fonts/docs/css2)

## なぜGoogle FontsのURLだけでは足りないか

2026-10-04の実HAでは、Google FontsのCSSとテーマのha-font-family-bodyは読み込まれていました。しかしbodyはRobotoを直接指定し、home-assistant・サイドバー・プロフィールの継承した書体はRobotoのままでした。フォント取得と、実際のfont-family指定は別です。

[DADSのCSS](../css/dads-fonts.css)はdocument全体でフォントを登録し、body・home-assistantの書体をDADSの変数へ接続します。テーマ側では[Material You Themeの実装](https://github.com/Nerwyn/material-you-theme/blob/main/themes/material_you.yaml)を参考に、旧primary-font-family・MDC・Material typeface・新ha-font-family・Web Awesomeの参照先を揃えています。card-modのShadow DOM内に置いた@importにフォントの登録を依存させません。

## 適用範囲

リソースのCSSはdocumentのheadへ登録され、同じ画面セッションのサイドバー・設定画面・詳細ダイアログからも参照できます。DADSのフォント変数またはアプリ上位からの継承を利用するコンポーネントに適用されます。

リソースはダッシュボードを開いたときに読み込まれます。新しいタブや再読み込み後に設定画面へ直接アクセスした場合は、一度ダッシュボードを開いてください。別documentのアドオン／iframe、ログイン画面、独自フォントを持つカスタムカードやコード用等幅文字は対象外です。

標準テーマに戻すとDADSの変数は外れ、CSSはHAのha-font-family-bodyに戻ります。アイコンや等幅フォントを一律に上書きするセレクターは使用していません。

## 以前のモジュール版から移行する場合

先に上記のStylesheetリソースを登録します。その後、configuration.yamlをバックアップし、frontend.extra_module_urlからha-dadsのnoto-sans-jp.jsだけを除いて設定チェック後にHAを再起動します。card-modなど他のURLは残してください。

## 確認・復帰

Networkでdads-fonts.css、Google FontsのCSSとWOFF2の取得を確認します。ChromeのElements → Computedでbody・home-assistant・対象の文字のfont-familyがNoto Sans JPになり、Rendered Fontsにも表示されるか確認します。CSS変数やdocument.fonts.checkだけを成功の証拠にしないでください。読み込み中・通信失敗・未収録文字には代替書体を使います。

フォント補正自体を止める場合は、リソース画面から追加したDADS CSSの項目を削除し、ブラウザーを再読み込みします。
