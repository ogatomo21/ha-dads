async (page) => {
  const directory = 'output/playwright';
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:4173');
  await page.waitForFunction(() => document.documentElement.dataset.ready === 'true');
  await page.waitForFunction(() => [...document.fonts].some(face => face.family.includes('Noto Sans JP')));
  const fonts = await page.evaluate(async () => {
    const faces = await document.fonts.load('400 16px "Noto Sans JP"', '日本語ABC123');
    await document.fonts.ready;
    return { family: getComputedStyle(document.body).fontFamily, loadedFaces: faces.length, status: document.fonts.status };
  });
  if (!fonts.family.startsWith('"Noto Sans JP"') || !fonts.loadedFaces || fonts.status !== 'loaded') throw new Error(`Webフォント読み込み: ${JSON.stringify(fonts)}`);
  const results = [];
  for (const mode of ['light', 'dark']) {
    await page.getByRole('combobox', { name: '配色', exact: true }).selectOption(mode);
    for (const scale of ['1', '2']) {
      await page.getByRole('combobox', { name: '文字サイズ', exact: true }).selectOption(scale);
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        const result = await page.evaluate(() => {
          const roots = [document, ...Array.from(document.querySelectorAll('dads-fixture')).map(element => element.shadowRoot)];
          const overflowing = roots.flatMap(root => Array.from(root.querySelectorAll('.label, .secondary, button, select')).filter(element => element.scrollWidth > element.clientWidth + 1).map(element => element.textContent.trim()));
          const sections = Array.from(document.querySelectorAll('.sections > section'));
          return {
            horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
            overflowing,
            columns: new Set(sections.map(section => Math.round(section.getBoundingClientRect().left))).size,
            fontSize: getComputedStyle(document.body).fontSize,
            mode: document.documentElement.dataset.mode,
          };
        });
        if (result.horizontalOverflow || result.overflowing.length) throw new Error(`Overflow ${mode}/${scale}/${width}: ${JSON.stringify(result)}`);
        if (width <= 390 && result.columns !== 1) throw new Error('モバイルは1列');
        if (width === 1440 && result.columns !== 3) throw new Error('デスクトップは3列');
        if (result.fontSize !== (scale === '1' ? '16px' : '32px')) throw new Error('文字倍率を反映できません');
        results.push({ mode, scale: Number(scale), width, ...result });
        await page.screenshot({ path: `${directory}/${mode}-${width}-${scale}x.png`, fullPage: true });
      }
    }
  }
  await page.getByRole('button', { name: '消灯する', exact: true }).click();
  if (await page.getByRole('button', { name: '点灯する', exact: true }).getAttribute('aria-pressed') !== 'false') throw new Error('照明OFF切替');
  await page.getByRole('button', { name: '点灯する', exact: true }).click();
  await page.getByRole('button', { name: '電源を入れる', exact: true }).click();
  if (await page.getByRole('button', { name: '電源を切る', exact: true }).getAttribute('aria-pressed') !== 'true') throw new Error('電源ON切替');
  if (!await page.getByRole('button', { name: '利用不可の操作', exact: true }).isDisabled()) throw new Error('無効操作');
  await page.getByRole('combobox', { name: '配色', exact: true }).selectOption('auto');
  await page.emulateMedia({ colorScheme: 'light' });
  await page.waitForFunction(() => document.documentElement.dataset.mode === 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.waitForFunction(() => document.documentElement.dataset.mode === 'dark');
  await page.getByRole('combobox', { name: '文字サイズ', exact: true }).selectOption('1');
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto('http://127.0.0.1:4173');
  await page.waitForFunction(() => document.documentElement.dataset.ready === 'true');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const focus = await page.evaluate(() => {
    const host = document.querySelector('dads-fixture[kind="power"]');
    const button = host.shadowRoot.activeElement;
    if (!button) return null;
    const style = getComputedStyle(button);
    return { label: button.textContent.trim(), visible: button.matches(':focus-visible'), outline: style.outline, outlineOffset: style.outlineOffset, boxShadow: style.boxShadow };
  });
  if (!focus?.visible || !focus.outline.includes('3px') || !focus.outline.includes('rgb(0, 0, 0)') || !focus.boxShadow.includes('rgb(255, 212, 61)')) throw new Error(`二重フォーカス: ${JSON.stringify(focus)}`);
  await page.screenshot({ path: `${directory}/keyboard-focus.png`, fullPage: true });
  if (errors.length) throw new Error(errors.join('\n'));
  const report = { scope: 'Standalone preview only; not Home Assistant', engine: 'Chromium', fonts, cases: results, focus, interactions: 'light/power toggles, disabled action, system light/dark: PASS', pageErrors: errors };
  return report;
}
