import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';

// Deterministic artwork: frozen canonical wordmark inside an original square frame, no AI asset.
const canonical = await readFile('assets/branding/StefCors_GL1tCh_0S_Glitch_Slow.svg', 'utf8');
const still = canonical.replace('viewBox="0 0 1200 360"', 'x="6" y="38" width="118" height="50" viewBox="220 45 760 265"')
  .replace('</style>', '#base,#red,#blue,.slice,.scan{animation:none!important}#red,#blue,.slice,.scan{opacity:0!important}</style>');
const source = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130"><rect width="130" height="130" rx="16" fill="#070c1b"/><path d="M17 5H113L125 17V113L113 125H17L5 113V17Z" fill="#10192b" stroke="#00ddf5" stroke-width="2"/><path d="M17 5H65M125 80V113L113 125H70" fill="none" stroke="#ff39cf" stroke-width="3"/>${still}</svg>`;
await mkdir('webos/icons', { recursive: true });
await writeFile('webos/icons/source.svg', source);
const profile = await mkdtemp(path.join(tmpdir(), 'glitch-icon-'));
const browser = spawn(process.env.CHROME_PATH ?? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank']);
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    let output = '';
    const timer = setTimeout(() => reject(new Error('Browser startup timeout')), 15000);
    browser.on('error', reject);
    browser.stderr.on('data', chunk => { output += chunk; const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/); if (match) { clearTimeout(timer); resolve(match[1]); } });
  });
  socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0; const pending = new Map();
  socket.onmessage = event => { const message = JSON.parse(event.data); const request = pending.get(message.id); if (request) { pending.delete(message.id); if (message.error) request.reject(new Error(JSON.stringify(message.error))); else request.resolve(message.result); } };
  const call = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const next = ++id; pending.set(next, { resolve, reject }); socket.send(JSON.stringify({ id: next, method, params, ...(sessionId ? { sessionId } : {}) })); });
  const { targetId } = await call('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await call('Target.attachToTarget', { targetId, flatten: true });
  for (const [file, size] of [['icon.png', 80], ['largeIcon.png', 130]]) {
    const result = await call('Runtime.evaluate', { awaitPromise: true, returnByValue: true, expression: `new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=${size};canvas.getContext('2d').drawImage(img,0,0,${size},${size});resolve(canvas.toDataURL('image/png').split(',')[1]);};img.onerror=reject;img.src=${JSON.stringify(`data:image/svg+xml,${encodeURIComponent(source)}`)};})` }, sessionId);
    assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
    await writeFile(`webos/icons/${file}`, Buffer.from(result.result.value, 'base64'));
    console.log(`${file}: ${size}x${size}`);
  }
} finally {
  socket?.close();
  if (browser.exitCode === null) { const exited = new Promise(resolve => browser.once('exit', resolve)); browser.kill(); await exited; }
  assert.equal(path.dirname(path.resolve(profile)), path.resolve(tmpdir()));
  assert(path.basename(profile).startsWith('glitch-icon-'));
  await rm(profile, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 });
}
