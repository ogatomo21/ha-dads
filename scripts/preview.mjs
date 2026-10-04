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
    ['/', ['index.html', 'text/html']],
    ['/preview.css', ['preview.css', 'text/css']],
    ['/theme.css', ['theme.css', 'text/css']],
    ['/preview.js', ['preview.js', 'text/javascript']],
    ['/card-styles.json', ['card-styles.json', 'application/json']],
  ]);
  const server = createServer(async (request, response) => {
    const entry = files.get(new URL(request.url, 'http://localhost').pathname);
    if (!entry || !['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(404).end();
      return;
    }
    try {
      const contents = await readFile(path.join(root, 'preview', entry[0]));
      response.writeHead(200, { 'Content-Type': `${entry[1]}; charset=utf-8`, 'Cache-Control': 'no-store' });
      response.end(request.method === 'HEAD' ? undefined : contents);
    } catch {
      response.writeHead(500).end('Preview file unavailable');
    }
  });
  server.listen(4173, '127.0.0.1', () => console.log('DADSプレビュー: http://127.0.0.1:4173 （実Home Assistantではありません）'));
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
}
