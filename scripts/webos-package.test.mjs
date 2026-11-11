import { describe, expect, it } from 'vitest';
import path from 'node:path';
import { localAssetPath, validateManifest, validatePng } from './webos-package-utils.mjs';
import { readIpkFiles } from './webos-ipk.mjs';
import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('webos/appinfo.json', 'utf8'));
describe('webOS packaging boundaries', () => {
  it('keeps application ID, brand, version and FHD contract aligned', () => {
    const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(() => validateManifest(manifest, version)).not.toThrow();
    expect(() => validateManifest(manifest, '0.0.0')).toThrow();
  });
  it('rejects unexpected platform privileges and settings instead of shipping them silently', () => {
    expect(() => validateManifest({ ...manifest, requiredPermissions: ['all'] }, manifest.version)).toThrow();
    expect(() => validateManifest({ ...manifest, requiredACG: ['application.launcher'] }, manifest.version)).toThrow();
    expect(() => validateManifest({ ...manifest, disableBackHistoryAPI: false }, manifest.version)).toThrow();
    expect(() => validateManifest({ ...manifest, resolution: '3840x2160' }, manifest.version)).toThrow();
  });
  it.each(['../.env', '/outside.png', 'https://example.com/icon.png', 'icons\\icon.png', 'icon.png?token=secret'])('rejects nonlocal asset path %s', relative => {
    expect(() => localAssetPath(path.resolve('dist-webos'), relative)).toThrow();
  });
  it('rejects malformed or incorrectly sized PNGs', () => {
    expect(() => validatePng(Buffer.alloc(24), 80)).toThrow();
    const png = Buffer.alloc(24); Buffer.from('89504e470d0a1a0a', 'hex').copy(png); png.writeUInt32BE(130, 16); png.writeUInt32BE(130, 20);
    expect(() => validatePng(png, 80)).toThrow();
  });
  it('rejects a different or incomplete artifact format', () => {
    expect(() => readIpkFiles(Buffer.from('not an IPK'))).toThrow();
    expect(() => readIpkFiles(Buffer.from('!<arch>\n'))).toThrow();
  });
});
