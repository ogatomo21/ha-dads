# card-modによるCSS補正

基本の配色・書体・カード形状はテーマだけで使用できます。長いタイル名の折り返し、余白、二重フォーカス、設定画面・ダイアログ等の補正にはcard-modを追加します。テーマには補正CSSを同梱しているため、カードごとのCSS記述は不要です。

## 導入

1. HACSで **card-mod** を検索してインストールします。本テーマの照合基準は4.2.1です。
2. **設定 → ダッシュボード → 右上メニュー → リソース**でcard-modの実際のURLをコピーします。リソース項目が出ない場合はプロフィールの詳細モードを確認します。
3. `configuration.yaml`をバックアップし、コピーしたURLを既存の`frontend.extra_module_url`へ追加します。

```yaml
frontend:
  themes: !include_dir_merge_named themes
  extra_module_url:
    - /hacsfiles/lovelace-card-mod/card-mod.js?hacstag=YOUR_ACTUAL_HACSTAG
```

これは`frontend`全体の例です。**`YOUR_ACTUAL_HACSTAG`を含むURLは例示用**なので、リソース画面からコピーした実際のURLへ置き換えます。既存のテーマincludeやモジュールを残してマージし、2つ目の`frontend`を作らないでください。[設定ファイル例](../examples/configuration-card-mod.yaml)

設定チェック後にHAを再起動し、ブラウザーを再読み込みしてプロフィールからDADSを選択します。HA OS等では設定チェックに`ha core check`を利用できます。

card-modをLovelaceリソースから読み込むだけでは、設定画面等への補正は読み込まれません。`extra_module_url`はフロントエンド全体に読み込むための設定です。クエリを含め、HACSのリソースと完全に同じURLを使用し、リソース自体は残してください。詳細は[card-modの公式説明](https://github.com/thomasloven/lovelace-card-mod)を参照してください。

## 更新時

- card-modをHACSで更新したらリソースのURLを再確認し、`extra_module_url`も同じ値へ更新してHAを再起動します。
- 重複パッチや版不一致の警告がある場合は、異なるクエリのURL、旧版と新版の混在を確認します。HACSのリソースを無条件に削除しないでください。
- キャッシュ更新は各端末で行います。まず強制再読み込みを試し、必要ならHAフロントエンド／Companionアプリのキャッシュを更新します。

## 適用範囲・解除

[対応表](compatibility.md)と[実HAでの受入項目](verification.md)を参照してください。HAやcard-modの更新時には内部構造に依存する補正を再確認します。

プロフィールで標準テーマに戻すとDADSの配色とCSS補正を解除できます。card-modを読み込めなくても基本テーマは使えますが、長いタイル名の折り返しや細かなCSS補正は適用されません。
