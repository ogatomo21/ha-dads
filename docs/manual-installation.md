# 手動導入（HACSを使わない場合）

通常は[HACSによる導入](../README.md#hacsから導入)を利用してください。GitHub公開前のローカルファイルを試す場合も、この方法で導入できます。

## コピー

HAの`/config/configuration.yaml`と、既存の同名テーマがあればそのファイルもバックアップします。バックアップ先はテーマの読み込み対象になる`themes`の外にします。

WindowsからHAのconfig共有フォルダへコピーする例です。**実際の共有先に置き換えてください**。実行場所はこのプロジェクトのフォルダです。

```powershell
$haConfigDir = '\\homeassistant\config'
$backupStamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$themeBackupDir = Join-Path $haConfigDir "theme-backups\$backupStamp"
New-Item -ItemType Directory -Path $themeBackupDir -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $haConfigDir 'configuration.yaml') -Destination (Join-Path $themeBackupDir 'configuration.yaml')
New-Item -ItemType Directory -Path (Join-Path $haConfigDir 'themes') -Force | Out-Null
if (Test-Path -LiteralPath (Join-Path $haConfigDir 'themes\dads.yaml')) {
    Copy-Item -LiteralPath (Join-Path $haConfigDir 'themes\dads.yaml') -Destination (Join-Path $themeBackupDir 'dads.yaml')
}
Copy-Item -LiteralPath '.\themes\dads.yaml' -Destination (Join-Path $haConfigDir 'themes\dads.yaml')
```

HACS版をすでに導入している場合は、手動版を追加せずHACSで更新してください。同名テーマの重複を避けます。共有を使用しない場合は既存のFile editor、Studio Code Server、SSH等で`/config/themes/dads.yaml`を配置できます。

## 読み込み

次を既存の`frontend`へマージします。ファイル全体を置き換えず、`frontend`を二重に定義しないでください。

```yaml
frontend:
  themes: !include_dir_merge_named themes
```

初めてテーマを有効にする場合は設定チェック後にHAを再起動します。すでに有効でYAMLだけ追加・更新した場合は、開発者ツールのアクションで次を実行します。

```yaml
action: frontend.reload_themes
```

プロフィールでDADSとライト／ダークのモードを選択します。CSS補正も利用する場合は[card-modの手順](card-mod.md)へ進みます。

元に戻すには標準テーマを選びます。設定変更で起動できない場合は、保存した`configuration.yaml`を元の場所へコピーして戻します。
