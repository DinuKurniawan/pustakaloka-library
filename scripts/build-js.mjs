import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';

const root = process.cwd();
const dist = path.join(root, 'dist');
const pages = [
  'home',
  'catalog',
  'book-detail',
  'about',
  'collections',
  'services',
  'reservation',
  'librarians',
  'news',
  'news-detail',
  'contact',
  'membership',
  'saved',
  'not-found',
];

await rm(path.join(dist, 'js'), { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await build({
  entryPoints: pages.map((page) => `src/js/pages/${page}.js`),
  bundle: true,
  minify: true,
  format: 'esm',
  target: 'es2022',
  splitting: true,
  outdir: path.join(dist, 'js'),
  outbase: path.join(root, 'src/js/pages'),
  entryNames: '[name]',
  chunkNames: 'chunks/[name]-[hash]',
  logLevel: 'info',
});

await cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });
await cp(path.join(root, 'favicon.svg'), path.join(dist, 'favicon.svg'));
await cp(path.join(root, 'robots.txt'), path.join(dist, 'robots.txt'));
await cp(path.join(root, 'sitemap.xml'), path.join(dist, 'sitemap.xml'));

const sourcePages = [
  'index.html',
  ...(await readdir(path.join(root, 'src/pages'))).map((page) => path.join('src/pages', page)),
];
for (const relativeFile of sourcePages) {
  const source = await readFile(path.join(root, relativeFile), 'utf8');
  const page = source
    .replace('./dist/output.css', './output.css')
    .replace(/(src|href)="\.\/src\/js\/pages\/([\w-]+)\.js"/g, '$1="./js/$2.js"');
  const output = path.join(dist, relativeFile);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, page);
}

console.log(`Built ${pages.length} JavaScript entry points and production HTML in dist/.`);
