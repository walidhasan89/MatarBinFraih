// Post-build step: rewrites every root-relative href/src/url() reference
// in the built output (dist/) into a path relative to that specific
// file, so the exact same build works whether it's deployed at a domain
// root, a subdomain, or nested at any subfolder depth (e.g.
// yourdomain.com/matarbinfraih/) — no env var, no rebuilding per target.
//
// - HTML files: rewrites href="/..." and src="/..." attributes.
// - CSS files: rewrites url(/...) references (bundled web fonts).
// - Absolute URLs (https://...), mailto:, tel:, //protocol-relative,
//   and in-page #anchors are left untouched — only site-internal
//   root-relative paths are affected.
// - Page targets (no file extension, e.g. "/about") get a trailing
//   slash appended so relative resolution stays correct across
//   further navigation, regardless of whether the web server
//   normalizes bare directory requests. Asset targets (have a file
//   extension, e.g. "/assets/foo.css") are left as exact file paths.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve(process.cwd(), 'dist');

async function walk(dir, exts) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full, exts)));
    else if (exts.some((ext) => entry.name.endsWith(ext))) files.push(full);
  }
  return files;
}

function toRelative(fromFile, rootRelativeUrl) {
  const urlPath = rootRelativeUrl === '/' ? '' : rootRelativeUrl.slice(1);
  const targetAbs = path.join(DIST, urlPath);
  const fromDir = path.dirname(fromFile);
  let rel = path.relative(fromDir, targetAbs).split(path.sep).join('/');
  if (rel === '') rel = '.';
  const isPage = !path.basename(urlPath).includes('.');
  if (isPage && !rel.endsWith('/')) rel += '/';
  if (!rel.startsWith('.') && !rel.startsWith('/')) rel = `./${rel}`;
  return rel;
}

const HTML_ATTR_RE = /(href|src)="(\/(?!\/)[^"]*)"/g;
const CSS_URL_RE = /url\((['"]?)(\/(?!\/)[^)'"]*)\1\)/g;

async function relativizeHtml(file) {
  const original = await readFile(file, 'utf8');
  const rewritten = original.replace(HTML_ATTR_RE, (_match, attr, url) => `${attr}="${toRelative(file, url)}"`);
  if (rewritten !== original) await writeFile(file, rewritten, 'utf8');
}

async function relativizeCss(file) {
  const original = await readFile(file, 'utf8');
  const rewritten = original.replace(CSS_URL_RE, (_match, quote, url) => `url(${quote}${toRelative(file, url)}${quote})`);
  if (rewritten !== original) await writeFile(file, rewritten, 'utf8');
}

const [htmlFiles, cssFiles] = await Promise.all([walk(DIST, ['.html']), walk(DIST, ['.css'])]);
await Promise.all([...htmlFiles.map(relativizeHtml), ...cssFiles.map(relativizeCss)]);

console.log(`Relativized ${htmlFiles.length} HTML and ${cssFiles.length} CSS file(s) for portable deployment.`);
