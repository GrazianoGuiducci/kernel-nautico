// Stamp each module dependency, not just index.html: cached ESM graphs must agree.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const dist = resolve(import.meta.dirname, '../dist');
const revision = JSON.parse(await readFile(resolve(dist, 'BUILD.json'), 'utf8')).runtimeRevision;
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) { await visit(path); continue; }
    if (!['.js', '.mjs', '.html'].includes(extname(path))) continue;
    const original = await readFile(path, 'utf8');
    let text = original;
    if (extname(path) === '.html') {
      text = text.replace(/((?:src|href)=["'])([^"'?]+\.(?:js|mjs|css))(["'])/g, `$1$2?v=${revision}$3`);
      text = text.replace(/("(?:three|three\/addons\/[^"]+)"\s*:\s*")([^"?]+\.js)(")/g, `$1$2?v=${revision}$3`);
    } else {
      text = text.replace(/((?:from\s*|import\s*\(?\s*)["'])(\.[^"'?]+\.(?:js|mjs))(["'])/g, `$1$2?v=${revision}$3`);
      text = text.replace(/(["'])(\.[^"'?]+\.css)\1/g, `$1$2?v=${revision}$1`);
    }
    if (text !== original) await writeFile(path, text);
  }
}
await visit(dist);
