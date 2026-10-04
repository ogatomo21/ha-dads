import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';

export const root = fileURLToPath(new URL('../', import.meta.url));

export function parseYaml(source, label = 'YAML') {
  const doc = parseDocument(source, { uniqueKeys: true, strict: true });
  if (doc.errors.length) {
    throw new Error(`${label}: ${doc.errors.map(error => error.message).join('\n')}`);
  }
  return doc.toJS({ maxAliasCount: 100 });
}

export async function loadTheme() {
  const source = await readFile(new URL('../themes/dads.yaml', import.meta.url), 'utf8');
  const themes = parseYaml(source, 'themes/dads.yaml');
  if (Object.keys(themes).join() !== 'DADS') throw new Error('テーマ名はDADSのみ');
  return themes.DADS;
}

export function modeVariables(theme, mode) {
  const { modes, ...common } = theme;
  if (!['light', 'dark'].includes(mode) || !modes?.[mode]) {
    throw new Error(`モード定義がありません: ${mode}`);
  }
  return { ...common, ...modes[mode] };
}

export function resolveVariable(variables, name, chain = []) {
  if (chain.includes(name)) throw new Error(`CSS変数循環: ${[...chain, name].join(' -> ')}`);
  if (!(name in variables)) throw new Error(`未定義CSS変数: --${name}`);
  return String(variables[name]).replace(
    /var\(\s*--([\w-]+)\s*(?:,\s*([^()]+))?\)/g,
    (_, referenced, fallback) => referenced in variables
      ? resolveVariable(variables, referenced, [...chain, name])
      : fallback !== undefined ? fallback.trim() : resolveVariable(variables, referenced, [...chain, name]),
  );
}

export function hexRgb(hex) {
  if (!/^#[a-f\d]{6}$/i.test(hex)) throw new Error(`不正なHEX色: ${hex}`);
  return [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16));
}

export function contrast(foreground, background) {
  const luminance = hex => {
    const channels = hexRgb(hex).map(value => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

export function cardStyles(theme) {
  return Object.fromEntries(Object.entries(theme)
    .filter(([name]) => name.startsWith('card-mod-') && name !== 'card-mod-theme')
    .map(([name, value]) => [name, name.endsWith('-yaml') ? parseYaml(value, name) : { '.': value }]));
}

export function themeCss(theme) {
  const declarations = mode => Object.entries(modeVariables(theme, mode))
    .filter(([name]) => !name.startsWith('card-mod-'))
    .map(([name, value]) => `  --${name}: ${value};`)
    .join('\n');
  return `/* Generated from themes/dads.yaml. Do not edit. */\n:root {\n  --ha-font-size-scale: 1;\n${declarations('light')}\n}\n:root[data-mode="dark"] {\n  color-scheme: dark;\n${declarations('dark')}\n}\n:root[data-mode="light"] { color-scheme: light; }\n`;
}
