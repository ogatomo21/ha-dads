import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contrast, parseYaml, resolveVariable } from '../scripts/theme.mjs';
import { checkProject } from '../scripts/check.mjs';

test('WCAG contrast: black/white, equal colors, symmetry', () => {
  assert.equal(contrast('#000000', '#ffffff'), 21);
  assert.equal(contrast('#ffffff', '#ffffff'), 1);
  assert.equal(contrast('#0017c1', '#ffffff'), contrast('#ffffff', '#0017c1'));
  assert.ok(contrast('#767676', '#ffffff') >= 4.5);
  assert.ok(contrast('#7f7f7f', '#ffffff') < 4.5);
  assert.throws(() => contrast('red', '#ffffff'), /HEX/);
});

test('YAML rejects duplicates at both outer and embedded CSS map levels', () => {
  assert.throws(() => parseYaml('DADS:\n  color: blue\n  color: red\n'), /unique/);
  assert.throws(() => parseYaml('.: one\n.: two\n'), /unique/);
  assert.deepEqual(parseYaml('a: &value hello\nb: *value\n'), { a: 'hello', b: 'hello' });
});

test('CSS variables resolve aliases and fallback, reject missing/cyclic references', () => {
  assert.equal(resolveVariable({ a: '#ffffff', b: 'var(--a)', c: 'var(--b)' }, 'c'), '#ffffff');
  assert.equal(resolveVariable({ a: 'calc(16px * var(--scale, 1))' }, 'a'), 'calc(16px * 1)');
  assert.throws(() => resolveVariable({ a: 'var(--missing)' }, 'a'), /未定義/);
  assert.throws(() => resolveVariable({ a: 'var(--b)', b: 'var(--a)' }, 'a'), /循環/);
});

test('HACS package, theme and dashboard satisfy shipping checks in both modes', async () => {
  const result = await checkProject();
  assert.ok(result.light.length > 0 && result.dark.length > 0);
  assert.ok(Object.values(result).flat().every(check => check.pass));
});
