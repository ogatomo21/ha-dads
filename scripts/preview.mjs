import { readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { loadTheme, root, themeCss, cardStyles } from './theme.mjs';
import path from 'node:path';

const theme = await loadTheme();
await writeFile(path.join(root, 'preview/theme.css'), themeCss(theme));
await writeFile(path.join(root, 'preview/card-styles.json'), JSON.stringify(cardStyles(theme), null, 2));
if (process.argv.includes('--build')) {
  console.log('プレビュー生成完了（テーマYAMLから色・CSS補正を読み込み）');
} else {
  const files = new Map([
    ['/', ['preview/index.html', 'text/html; charset=utf-8']],
    ['/preview.css', ['preview/preview.css', 'text/css; charset=utf-8']],
    ['/theme.css', ['preview/theme.css', 'text/css; charset=utf-8']],
    ['/preview.js', ['preview/preview.js', 'text/javascript; charset=utf-8']],
    ['/card-styles.json', ['preview/card-styles.json', 'application/json']],
  ]);
  const server = createServer(async (request, response) => {
    const entry = files.get(new URL(request.url, 'http://localhost').pathname);
    if (!entry || !['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(404).end();
      return;
    }
    try {
      const contents = await readFile(path.join(root, entry[0]));
      response.writeHead(200, { 'Content-Type': entry[1], 'Cache-Control': 'no-store' });
      response.end(request.method === 'HEAD' ? undefined : contents);
    } catch {
      response.writeHead(500).end('Preview file unavailable');
    }
  });
  const port = Number(process.env.DADS_PREVIEW_PORT || 4173);
  server.listen(port, '127.0.0.1', () => console.log(`DADSプレビュー: http://127.0.0.1:${port} （実Home Assistantではありません）`));
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
}
