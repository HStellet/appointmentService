import assert from "assert";
import fs from 'fs';
import path from 'path';
import url from 'url';

console.log('Running client basic test...');

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const clientRoot = path.join(__dirname, '..');
const pkgPath = path.join(clientRoot, 'package.json');
assert.ok(fs.existsSync(pkgPath), 'client/package.json must exist');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
assert.ok(pkg.scripts && (pkg.scripts.start || pkg.scripts.dev || pkg.scripts.build), 'package.json should include start/dev/build script');

const srcDir = path.join(clientRoot, 'src');
assert.ok(fs.existsSync(srcDir) && fs.statSync(srcDir).isDirectory(), 'client/src directory must exist');

const indexHtmlPaths = [
  path.join(clientRoot, 'public', 'index.html'),
  path.join(clientRoot, 'index.html'),
];
const hasIndex = indexHtmlPaths.some(p => fs.existsSync(p));
assert.ok(hasIndex, 'index.html should exist in client (public/index.html or client root)');

console.log('Client basic test passed');
process.exit(0);
