import { mkdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { validateWebosStage } from './webos-package-utils.mjs';

const { version } = JSON.parse(await readFile('package.json', 'utf8'));
await validateWebosStage('dist-webos', version);
await mkdir('artifacts', { recursive: true });
// Constant CLI arguments, no device selection, shell interpolation or automatic installation.
const result = process.platform === 'win32'
  ? spawnSync('cmd.exe', ['/d', '/s', '/c', 'ares-package --no-minify dist-webos -o artifacts'], { stdio: 'inherit' })
  : spawnSync('ares-package', ['--no-minify', 'dist-webos', '-o', 'artifacts'], { stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) throw new Error(`ares-package failed (${result.status}). Is @webos-tools/cli installed?`);
await import('./verify-webos-ipk.mjs');
