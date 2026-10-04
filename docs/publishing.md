# GitHub配布とHACS検証

このフォルダはHACSの **Theme** カテゴリー向けに構成しています。今回の作業では公開・push・Release作成は行っていません。ローカルファイルだけではHACSからダウンロードできず、[公開GitHubリポジトリ](https://www.hacs.xyz/docs/publish/start/)が必要です。

## 公開先と構成

READMEのボタンは`https://github.com/ogatomo21/ha-dads`を配布先として用意しています。別の公開先を使う場合は、README内のリポジトリURLとMy Home Assistantリンクの`owner`／`repository`を変更してください。

リポジトリのルートに次を配置します。`ha-dads`フォルダ全体をさらにサブフォルダへ入れないでください。

```text
hacs.json
themes/
  dads.yaml
README.md
LICENSE
THIRD_PARTY_NOTICES.md
assets/
  preview-light.png
  preview-dark.png
.github/workflows/
  check.yml
  hacs.yml
```

開発用の`docs`・`examples`・`scripts`・`test`・`preview`・npmのファイルも公開できます。`.gitignore`に従い、`node_modules`・参照キャッシュ・生成したプレビューCSS等は含めません。HACSのテーマ保存先は通常`/config/themes/dads/dads.yaml`で、インストール対象はテーマ本体です。card-modは別途導入し、ダッシュボード例は自動登録しません。

`themes`には配布用YAMLを1つだけ置き、ライト／ダークをその`modes`にまとめます。[HACSテーマ構造の仕様](https://www.hacs.xyz/docs/publish/theme/)

## GitHub側の設定

- 可視性：Public
- Descriptionの例：`Digital Agency Design System inspired light/dark theme for Home Assistant.`
- Topicsの例：`home-assistant`、`hacs`、`hacs-theme`、`dads`
- Issues：有効
- Actions：有効

公開後は **Check theme** と **Validate HACS** の両ワークフローを確認します。push／pull requestで動作し、Actionsタブから手動実行もできます。HACS検証は[公式の`hacs/action`](https://www.hacs.xyz/docs/publish/action/)を使用し、公開先の説明・Topics・README画像など、ローカルでは確認できない条件もチェックします。

## 版の管理

初回はReleaseを作らなくても、デフォルトブランチの内容をHACSから導入できます。`hide_default_branch`は設定していません。

版を固定して配布する場合は、検証済みのコミットを対象に`v1.0.0`等のタグで **GitHub Release** を作成します。タグの作成だけではHACSのRelease版にはなりません。Releaseを使い始めた後は、変更を配布する際も新しいReleaseを作成してください。テーマはリポジトリ内のYAMLから取得されるため、ZIPの添付は不要です。

## HACSでの最終確認

公開後に実HAで次を確認します。現時点では未実施です。

1. テーマ読み込みを有効にし、READMEのボタンかカスタムリポジトリ登録で追加できる。
2. カテゴリーがTheme、表示名がDADS Themeで、ダウンロード後にプロフィールからDADSを選べる。
3. card-modなしでライト／ダークの基本テーマが適用される。
4. card-modを追加してCSS補正が適用される。
5. HACSで更新し、標準テーマへ戻してアンインストールできる。

カスタムリポジトリとしての導入とHACS標準一覧への掲載は別です。一覧に掲載して検索だけで導入できるようにするには、[HACS default repositoriesへの申請](https://www.hacs.xyz/docs/publish/include/)が必要です。
