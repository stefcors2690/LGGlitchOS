import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

export const webosAppId = 'com.stefcors.glitchos';
export function validateManifest(manifest, version) {
  assert.equal(manifest.id, webosAppId);
  assert.equal(manifest.version, version, 'Package and application versions must agree');
  assert.equal(manifest.title, 'StefCors GL1tCh 0S');
  assert.equal(manifest.type, 'web');
  assert.equal(manifest.main, 'index.html');
  assert.equal(manifest.resolution, '1920x1080');
  assert.equal(manifest.icon, 'icon.png'); assert.equal(manifest.largeIcon, 'largeIcon.png');
  assert.deepEqual(manifest.requiredACG, ['systemconfig.query'], 'Only the reviewed system information read group is allowed');
  assert.equal(manifest.disableBackHistoryAPI, true);
  const allowed = ['id', 'version', 'vendor', 'type', 'main', 'title', 'appDescription', 'icon', 'largeIcon', 'resolution', 'iconColor', 'requiredACG', 'disableBackHistoryAPI'];
  assert(Object.keys(manifest).every(key => allowed.includes(key)), 'Review new platform metadata explicitly');
}

export function validatePng(bytes, size) {
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(bytes.readUInt32BE(16), size); assert.equal(bytes.readUInt32BE(20), size);
}

export function localAssetPath(root, relative) {
  assert(!path.isAbsolute(relative) && !relative.includes(':') && !relative.includes('\\') && !relative.includes('?') && !relative.includes('#'));
  const resolved = path.resolve(root, relative);
  assert(resolved.startsWith(`${path.resolve(root)}${path.sep}`), 'Asset must stay inside the package');
  return resolved;
}

export async function validateWebosStage(root, version) {
  const manifest = JSON.parse(await readFile(path.join(root, 'appinfo.json'), 'utf8'));
  validateManifest(manifest, version);
  validatePng(await readFile(localAssetPath(root, manifest.icon)), 80);
  validatePng(await readFile(localAssetPath(root, manifest.largeIcon)), 130);
  const html = await readFile(localAssetPath(root, manifest.main), 'utf8');
  assert(!/type=["']module|modulepreload|crossorigin/.test(html), 'Packaged entry uses classic deferred script, no module CORS');
  const entries = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]);
  assert(entries.some(entry => entry.endsWith('.js')) && entries.some(entry => entry.endsWith('.css')));
  for (const entry of entries) assert((await stat(localAssetPath(root, entry))).isFile());
  assert(html.includes('<script defer src="./assets/webOSTV.js"></script>'), 'Load the local official SDK before the app');
  assert(html.indexOf('./assets/webOSTV.js') < html.indexOf('./assets/index-'));
  assert.equal(createHash('sha256').update(await readFile(path.join(root, 'assets/webOSTV.js'))).digest('hex'),
    '2e83e028aef8651ef0b79b25a70c7ebc076a36781486a68623634bc0c2162670', 'Review official SDK upgrades explicitly');
  assert((await readFile(path.join(root, 'assets/LICENSE-webOSTV.txt'), 'utf8')).includes('Apache License'));
  const files = [];
  async function walk(relative = '') {
    for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
      assert(!entry.isSymbolicLink(), 'No symlinks in package');
      const name = path.posix.join(relative, entry.name);
      if (entry.isDirectory()) await walk(name);
      else files.push(name);
    }
  }
  await walk();
  assert(files.every(file => ['appinfo.json', 'index.html', 'icon.png', 'largeIcon.png', 'assets/LICENSE-webOSTV.txt'].includes(file) || /^assets\/[^/]+\.(js|css|png|svg)$/.test(file)), 'Package only app outputs, never fixtures/configuration/credentials');
  for (const file of files.filter(file => /\.(js|css|html)$/.test(file))) {
    const source = await readFile(path.join(root, file), 'utf8');
    assert(!/remote-toggle|background-tools-toggle|Scenari tecnici Demo|PlatformFixture|ProfileFixture|@vite\/client/.test(source), 'No development tools or fixtures');
  }
  return { manifest, files: files.sort() };
}
