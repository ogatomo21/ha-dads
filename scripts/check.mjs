import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import postcss from 'postcss';
import { loadTheme, root, parseYaml, cardStyles, modeVariables, resolveVariable, contrast, hexRgb } from './theme.mjs';

export function contrastChecks(variables) {
  const checks = [];
  const add = (foreground, background, minimum) => {
    const value = contrast(resolveVariable(variables, foreground), resolveVariable(variables, background));
    checks.push({ foreground, background, minimum, value: Number(value.toFixed(3)), pass: value >= minimum });
  };
  const surfaces = ['dads-background', 'dads-surface', 'dads-surface-secondary', 'dads-surface-elevated'];
  for (const surface of surfaces) {
    for (const foreground of ['dads-text', 'dads-text-secondary', 'dads-text-disabled', 'dads-primary', 'dads-success', 'dads-warning', 'dads-error']) {
      add(foreground, surface, 4.5);
    }
    add('dads-border', surface, 3);
  }
  for (const fill of ['dads-primary', 'dads-primary-hover', 'dads-primary-active']) add('dads-on-primary', fill, 4.5);
  for (const foreground of ['dads-text', 'dads-primary']) add(foreground, 'dads-selected', 4.5);
  add('dads-focus-black', 'dads-focus-yellow', 3);
  for (const strength of ['quiet', 'normal', 'loud']) {
    for (const state of ['resting', 'hover', 'active']) {
      for (const family of ['primary', 'neutral', 'success', 'warning', 'danger']) {
        add(`ha-color-on-${family}-${strength}`, `ha-color-fill-${family}-${strength}-${state}`, 4.5);
      }
    }
  }
  return checks;
}

function checkReferences(variables, styles) {
  for (const [name, value] of Object.entries(variables)) {
    if (!name.startsWith('card-mod-')) {
      assert.ok(['string', 'number'].includes(typeof value), `${name}はスカラー値`);
      assert.ok(!resolveVariable(variables, name).includes('var('), `${name}を解決できません`);
    }
  }
  const walk = value => {
    if (typeof value === 'string') {
      for (const match of value.matchAll(/var\(\s*--([\w-]+)/g)) resolveVariable(variables, match[1]);
      postcss.parse(value, { from: undefined, map: false });
    } else {
      assert.ok(value && typeof value === 'object' && !Array.isArray(value), 'card-modはCSS文字列またはマップ');
      for (const nested of Object.values(value)) walk(nested);
    }
  };
  for (const style of Object.values(styles)) walk(style);
}

export async function checkProject() {
  const manifest = JSON.parse(await readFile(path.join(root, 'hacs.json'), 'utf8'));
  assert.equal(typeof manifest.name, 'string');
  assert.ok(manifest.name.trim(), 'HACS表示名が必要');
  assert.equal(manifest.filename, 'dads.yaml');
  assert.match(manifest.homeassistant, /^\d{4}\.\d{1,2}\.\d+$/);
  assert.ok(!manifest.content_in_root, 'HACSはthemesディレクトリから取得');
  assert.ok(!manifest.hide_default_branch, 'Release公開前もデフォルトブランチから導入可能');
  const themeFiles = await readdir(path.join(root, 'themes'));
  assert.deepEqual(themeFiles, [manifest.filename], 'HACSの管理対象はテーマYAML 1つ');
  const theme = await loadTheme();
  assert.equal(theme['dads-font-family'], '"Noto Sans JP", sans-serif');
  postcss.parse(await readFile(path.join(root, 'css/dads-fonts.css'), 'utf8'));
  assert.equal(theme['card-mod-theme'], 'DADS');
  assert.deepEqual(Object.keys(theme.modes).sort(), ['dark', 'light']);
  // State色を包括的に上書きすると、警報・照明・空調の意味が変わってしまう。
  for (const key of Object.keys(theme)) assert.ok(!key.startsWith('state-'), `HAの状態色を維持: ${key}`);
  const styles = cardStyles(theme);
  for (const hook of ['card', 'sidebar', 'root', 'top-app-bar-fixed', 'config', 'dialog', 'more-info']) {
    assert.ok(styles[`card-mod-${hook}`] || styles[`card-mod-${hook}-yaml`], `${hook}のCSSが必要`);
  }
  const report = {};
  for (const mode of ['light', 'dark']) {
    const variables = modeVariables(theme, mode);
    for (const key of Object.keys(theme.modes[mode])) assert.ok(!key.startsWith('state-'), 'モード内も状態色を維持');
    checkReferences(variables, styles);
    for (const [rgbName, colorName] of Object.entries({
      'rgb-primary-color': 'primary-color', 'rgb-accent-color': 'accent-color',
      'rgb-primary-text-color': 'primary-text-color', 'rgb-secondary-text-color': 'secondary-text-color',
      'rgb-text-primary-color': 'text-primary-color', 'rgb-card-background-color': 'card-background-color',
      'rgb-error-color': 'error-color', 'rgb-warning-color': 'warning-color',
      'rgb-success-color': 'success-color', 'rgb-info-color': 'info-color',
    })) {
      assert.deepEqual(String(variables[rgbName]).split(',').map(Number), hexRgb(resolveVariable(variables, colorName)), rgbName);
    }
    report[mode] = contrastChecks(variables);
    const failures = report[mode].filter(check => !check.pass);
    assert.equal(failures.length, 0, `${mode} コントラスト不足:\n${JSON.stringify(failures, null, 2)}`);
  }
  const dashboard = parseYaml(await readFile(path.join(root, 'examples/dashboard.yaml'), 'utf8'), 'dashboard.yaml');
  for (const view of dashboard.views) {
    assert.equal(view.type, 'sections');
    assert.equal(view.max_columns, 3);
    assert.equal(view.dense_section_placement, false);
    assert.ok(!view.theme, 'ビュー固定テーマを避けプロフィールから全体へ適用する');
    for (const section of view.sections) {
      for (const card of section.cards) {
        assert.ok(!card.type.startsWith('custom:'), '標準カードのみ');
        if (card.grid_options) {
          assert.equal(card.grid_options.columns, 12);
          assert.equal(card.grid_options.rows, 'auto');
        }
      }
    }
  }
  for (const file of await readdir(path.join(root, 'examples'))) {
    if (!file.endsWith('.yaml')) continue;
    parseYaml(await readFile(path.join(root, 'examples', file), 'utf8'), file);
  }
  for (const file of await readdir(path.join(root, '.github/workflows'))) {
    if (!/\.ya?ml$/.test(file)) continue;
    const workflow = parseYaml(await readFile(path.join(root, '.github/workflows', file), 'utf8'), file);
    if (file === 'hacs.yml') {
      assert.ok(Object.hasOwn(workflow.on, 'workflow_dispatch'), 'HACS検証を手動実行可能にする');
      const step = workflow.jobs['validate-hacs'].steps.find(step => step.uses === 'hacs/action@main');
      assert.equal(step?.with?.category, 'theme');
    }
  }
  for (const file of ['preview/preview.css']) postcss.parse(await readFile(path.join(root, file), 'utf8'), { from: file, map: false });
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const report = await checkProject();
    console.log(`PASS: HACS構成/YAML/CSS/変数/RGB/ダッシュボード、コントラスト ${Object.values(report).flat().length}組`);
    for (const [mode, checks] of Object.entries(report)) {
      const textMinimum = Math.min(...checks.filter(check => check.minimum === 4.5).map(check => check.value));
      const borderMinimum = Math.min(...checks.filter(check => check.minimum === 3).map(check => check.value));
      console.log(`${mode}: 文字最小 ${textMinimum}:1、非テキスト最小 ${borderMinimum}:1`);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
