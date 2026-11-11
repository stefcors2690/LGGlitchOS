import assert from 'node:assert/strict';
import { gunzipSync } from 'node:zlib';

/** Inspect ar/tar bytes without extracting any archive paths to disk. */
export function readIpkFiles(bytes) {
  assert.equal(bytes.subarray(0, 8).toString(), '!<arch>\n', 'IPK must be an ar archive');
  let data;
  for (let offset = 8; offset + 60 <= bytes.length;) {
    const header = bytes.subarray(offset, offset + 60);
    assert.equal(header.subarray(58).toString(), '`\n');
    const size = Number(header.subarray(48, 58).toString().trim());
    assert(Number.isSafeInteger(size) && size >= 0 && offset + 60 + size <= bytes.length);
    if (header.subarray(0, 16).toString().trim().replace(/\/$/, '') === 'data.tar.gz') data = bytes.subarray(offset + 60, offset + 60 + size);
    offset += 60 + size + size % 2;
  }
  assert(data, 'IPK needs data.tar.gz');
  const tar = gunzipSync(data), files = new Map();
  for (let offset = 0; offset + 512 <= tar.length;) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every(byte => byte === 0)) break;
    const field = (start, end) => header.subarray(start, end).toString().split('\0')[0];
    const size = parseInt(field(124, 136).trim() || '0', 8);
    assert(Number.isSafeInteger(size) && size >= 0 && offset + 512 + size <= tar.length);
    const name = [field(345, 500), field(0, 100)].filter(Boolean).join('/').replace(/^\.\//, '');
    if (['0', '\0'].includes(String.fromCharCode(header[156]))) {
      assert(!files.has(name), 'No duplicate archive entry');
      files.set(name, tar.subarray(offset + 512, offset + 512 + size));
    }
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  return files;
}
