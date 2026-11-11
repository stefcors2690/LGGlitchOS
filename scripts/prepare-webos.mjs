import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { validateManifest, validateWebosStage } from './webos-package-utils.mjs';

const { version } = JSON.parse(await readFile('package.json', 'utf8'));
const manifest = JSON.parse(await readFile('webos/appinfo.json', 'utf8'));
validateManifest(manifest, version);
// Vite emits one IIFE in webOS mode; the file-scheme entry must be a classic deferred script.
const html = await readFile('dist-webos/index.html', 'utf8');
if (!html.includes('type="module"')) throw new Error('Unexpected Vite output: review packaged script handling');
await writeFile('dist-webos/index.html', html.replace(/type="module"\s*/g, 'defer ').replace(/\s+crossorigin(?:="[^"]*")?/g, '').replace('<head>', '<head>\n    <script defer src="./assets/webOSTV.js"></script>'));
await copyFile('webos/vendor/webOSTV.js', 'dist-webos/assets/webOSTV.js');
await copyFile('webos/vendor/LICENSE-2.0.txt', 'dist-webos/assets/LICENSE-webOSTV.txt');
await copyFile('webos/appinfo.json', 'dist-webos/appinfo.json');
for (const file of ['icon.png', 'largeIcon.png']) await copyFile(`webos/icons/${file}`, `dist-webos/${file}`);
const result = await validateWebosStage('dist-webos', version);
console.log(`webOS stage valid: ${manifest.id}@${version}, ${result.files.length} local files`);
