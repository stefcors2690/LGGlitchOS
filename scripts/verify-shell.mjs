// Manual browser acceptance check. No npm dependency: uses local Chrome + Node WebSocket.
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';

const baseUrl = process.env.SHELL_URL ?? 'http://127.0.0.1:5187';
const executable = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const profile = await mkdtemp(path.join(tmpdir(), 'glitch-chrome-'));
const chrome = spawn(executable, ['--headless=new', '--disable-gpu', '--no-first-run',
  '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank']);
let socket;
try {
  const debugUrl = await new Promise((resolve, reject) => {
    let output = '';
    const timeout = setTimeout(() => reject(new Error('Chrome startup timed out')), 15000);
    chrome.on('error', reject);
    chrome.on('exit', code => { clearTimeout(timeout); reject(new Error(`Chrome exited: ${code}: ${output}`)); });
    chrome.stderr.on('data', chunk => {
      output += chunk;
      const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) { clearTimeout(timeout); resolve(match[1]); }
    });
  });
  socket = new WebSocket(debugUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let nextId = 0;
  const pending = new Map();
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const request = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) request.reject(new Error(JSON.stringify(message.error)));
      else request.resolve(message.result);
    }
  };
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const call = (method, params) => send(method, params, sessionId);
  const evaluate = async expression => {
    const response = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
    return response.result.value;
  };
  await call('Page.enable');
  const waitReady = async expression => {
    for (let retry = 0; retry < 100; retry++) {
      if (await evaluate(expression)) return;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error(`Page did not become ready: ${expression}`);
  };
  await mkdir('docs/verification', { recursive: true });
  const results = [];
  for (const [width, height] of [[1920, 1080], [3840, 2160], [390, 844]]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await call('Page.navigate', { url: baseUrl });
    await waitReady('!!document.querySelector(".brand-logo img")?.complete && !!document.querySelector(".shell-footer")');
    const metrics = await evaluate(`(() => {
      const rect = element => { const r = element.getBoundingClientRect(); return { x:r.x, y:r.y, width:r.width, height:r.height, right:r.right, bottom:r.bottom }; };
      const shell = document.querySelector('.tv-shell');
      const image = document.querySelector('.brand-logo img');
      return {
        width:innerWidth, height:innerHeight,
        shell:rect(shell), header:rect(document.querySelector('.shell-header')), footer:rect(document.querySelector('.shell-footer')),
        widgets:[...document.querySelectorAll('.widget-placeholder')].map(rect),
        imageLoaded:image.naturalWidth > 0, source:image.src, currentSource:image.currentSrc,
        horizontalOverflow:document.documentElement.scrollWidth > innerWidth,
        verticalOverflow:document.documentElement.scrollHeight > innerHeight,
        fontSize:getComputedStyle(document.querySelector('.scene-description')).fontSize,
        reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches
      };
    })()`);
    assert(metrics.imageLoaded, 'Logo failed to load');
    assert(!metrics.horizontalOverflow, 'Horizontal overflow');
    assert(metrics.reducedMotion);
    assert(metrics.currentSource.startsWith('data:image/svg+xml,'), 'Reduced-motion picture must choose the still logo');
    if (width >= 1920) {
      assert(!metrics.verticalOverflow, 'Vertical overflow on TV');
      assert(Math.abs(metrics.shell.width / metrics.shell.height - 16 / 9) < 0.001);
      assert(metrics.header.x >= width * 0.039, 'TV safe left margin');
      assert(metrics.footer.bottom <= height - height * 0.04, 'TV safe bottom margin');
      assert(metrics.widgets.every(r => r.right <= width && r.bottom <= metrics.footer.y));
    }
    const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    await writeFile(`docs/verification/shell-${width}x${height}.png`, Buffer.from(screenshot.data, 'base64'));
    results.push(metrics);
  }
  await evaluate('document.querySelector(".brand-logo img").dispatchEvent(new Event("error"))');
  await waitReady('document.querySelector(".brand-logo span")?.textContent === "StefCors GL1tCh 0S"');
  await call('Page.navigate', { url: results[0].currentSource });
  await waitReady('!!document.querySelector("svg #base")');
  assert.equal(await evaluate('getComputedStyle(document.querySelector("#base")).animationName'), 'none');
  // Inspect canonical SVG standalone in both motion modes; also confirms embedded source was valid.
  await call('Page.navigate', { url: results[0].source });
  await waitReady('!!document.querySelector("svg #base")');
  for (const value of ['reduce', 'no-preference']) {
    await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value }] });
    const animation = await evaluate('getComputedStyle(document.querySelector("#base")).animationName');
    assert.equal(animation, value === 'reduce' ? 'none' : 'shake');
  }
  // Sample two complete 9-second animation cycles and verify timing actually advances.
  const before = await evaluate('document.querySelector("#base").getAnimations()[0].currentTime');
  await new Promise(resolve => setTimeout(resolve, 18200));
  const after = await evaluate('document.querySelector("#base").getAnimations()[0].currentTime');
  assert(after - before >= 18000, 'SVG animation timeline did not advance for two cycles');
  await writeFile('docs/verification/shell-metrics.json', JSON.stringify({ baseUrl, results: results.map(({ source, currentSource, ...metrics }) => ({ ...metrics, canonicalSource: source.startsWith('data:') ? 'bundled data URI' : source, stillSourceSelected: currentSource.startsWith('data:image/svg+xml,') })), svgAnimation: { reducedMotion: 'none', normal: 'shake', elapsedMs: after - before } }, null, 2) + '\n');
  console.log('Shell acceptance passed: 1080p, 4K, mobile fallback, logo and reduced-motion SVG.');
} finally {
  socket?.close();
  chrome.kill();
  await new Promise(resolve => chrome.once('exit', resolve));
  await rm(profile, { recursive: true, force: true });
}
