import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { readIpkFiles } from './webos-ipk.mjs';
import { validateWebosStage } from './webos-package-utils.mjs';

const { version } = JSON.parse(await readFile('package.json', 'utf8'));
const { manifest, files } = await validateWebosStage('dist-webos', version);
const artifact = `artifacts/${manifest.id}_${version}_all.ipk`;
const bytes = await readFile(artifact), entries = readIpkFiles(bytes);
const prefix = `usr/palm/applications/${manifest.id}/`;
const appFiles = [...entries.keys()].filter(name => name.startsWith(prefix)).map(name => name.slice(prefix.length)).sort();
assert.deepEqual(appFiles, files, 'Archive app files must exactly match the validated stage');
for (const file of files) assert(entries.get(prefix + file).equals(await readFile(`dist-webos/${file}`)), `Archive mismatch: ${file}`);
const proof = { id: manifest.id, version, artifact, bytes: bytes.length,
  sha256: createHash('sha256').update(bytes).digest('hex'), appFiles, archiveFiles: [...entries.keys()].sort(),
  validated: 'Manifest, icon sizes, local HTML assets, allowed files, no dev tools, byte comparison IPK/stage. No TV installation performed.' };
await writeFile('artifacts/package-report.json', JSON.stringify(proof, null, 2));
console.log(JSON.stringify(proof, null, 2));
