// Developer Mode inspection of our app only. Endpoint comes from ares-inspect, never tracked.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const endpoint = new URL(process.env.TV_INSPECT_WS ?? '');
if (endpoint.protocol !== 'ws:' || !['localhost', '127.0.0.1'].includes(endpoint.hostname)) throw new Error('Use the local ares-inspect tunnel');
const directory = process.env.TV_VERIFY_OUTPUT ?? 'docs/verification/phase-4.4/device';
const socket = new WebSocket(endpoint);
const pending = new Map();
const observedErrors = [];
let nextId = 0;
await new Promise((resolve, reject) => {
  const timer = setTimeout(() => { socket.close(); reject(new Error('Inspector connection timed out; reopen ares-inspect')); }, 15_000);
  socket.onopen = () => { clearTimeout(timer); resolve(); };
  socket.onerror = () => { clearTimeout(timer); reject(new Error('Inspector connection failed; reopen ares-inspect and use its current endpoint')); };
});
socket.onmessage = event => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') observedErrors.push('Runtime.exceptionThrown');
  if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') observedErrors.push('console.error');
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id); clearTimeout(request.timer);
  if (message.error) request.reject(new Error(JSON.stringify(message.error)));
  else request.resolve(message.result);
};
const call = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId;
  const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Inspector timeout: ${method}`)); }, 15_000);
  pending.set(id, { resolve, reject, timer });
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async expression => {
  const response = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error('TV evaluation failed');
  return response.result.value;
};
try {
  await call('Runtime.enable');
  await call('Page.enable');
  const app = await evaluate(`({title:document.title,ownApp:document.title.includes('StefCors GL1tCh 0S')})`);
  if (!app.ownApp) throw new Error('Inspector target is not our app');
  if (process.env.TV_IDLE_PROBE === '1') {
    await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Shift',bubbles:true}))`);
  }
  await mkdir(directory, { recursive: true });
  const snapshot = await evaluate(`({
    title:document.title,userAgent:navigator.userAgent,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},
    scripts:[...document.scripts].map(el=>el.src.split('/').pop()),
    visibility:document.visibilityState,webosTv:window.webOS?.platform?.tv===true,
    shell:{...document.querySelector('.tv-shell')?.dataset},
    footer:document.querySelector('.shell-footer')?.textContent,
    system:document.querySelector('[data-system-info]')?.textContent,
    image:{loaded:!!document.querySelector('.background-image')?.naturalWidth},
    canvas:[...document.querySelectorAll('canvas')].map(el=>({width:el.width,height:el.height,data:{...el.dataset}})),
    controls:[...document.querySelectorAll('[data-tv-id]')].map(el=>({id:el.dataset.tvId,label:el.getAttribute('aria-label')||el.textContent,disabled:el.getAttribute('aria-disabled')})),
    activeId:document.activeElement?.dataset?.tvId,
    overflow:document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight
  })`);
  // DOMStringMap must be copied before CDP returnByValue on some Chromium builds.
  await writeFile(path.join(directory, 'snapshot.json'), JSON.stringify({ at: new Date().toISOString(), snapshot, observedErrors,
    limitations: 'Device Inspector DOM snapshot; no physical remote or display verification. Errors observed only since attachment.' }, null, 2));
  try {
    const screenshot = await call('Page.captureScreenshot', { format: 'png' });
    await writeFile(path.join(directory, 'screen.png'), Buffer.from(screenshot.data, 'base64'));
  } catch (error) { console.log(`Screenshot unavailable: ${error.message}`); }
  console.log(JSON.stringify(snapshot, null, 2));
  const duration = Number(process.env.TV_SAMPLE_MS ?? 0);
  if (duration) {
    if (!Number.isFinite(duration) || duration < 5_000 || duration > 300_000) throw new Error('TV_SAMPLE_MS must be 5000..300000');
    const samples = [];
    const started = Date.now();
    while (Date.now() - started < duration) {
      await new Promise(resolve => setTimeout(resolve, Math.min(2000, duration - (Date.now() - started))));
      samples.push({ elapsedMs: Date.now() - started, ...await evaluate(`({
        visibility:document.visibilityState,idle:document.querySelector('.tv-shell')?.dataset.idle,
        opacity:getComputedStyle(document.querySelector('.tv-shell')).opacity,
        backgroundMotion:document.querySelector('.cyberpunk-background')?.dataset.motion,
        activeId:document.activeElement?.dataset?.tvId,
        canvas:[...document.querySelectorAll('canvas')].map(el=>({...el.dataset})),
        nodes:document.querySelectorAll('*').length
      })`) });
    }
    const result = { requestedMs: duration, actualMs: Date.now() - started, samples, observedErrors, controlledIdleStart: process.env.TV_IDLE_PROBE === '1',
      limitations: 'Read-only samples on physical TV; existing Canvas draw monitor, not GPU or physical input latency. User input is not generated or blocked.' };
    await writeFile(path.join(directory, 'samples.json'), JSON.stringify(result, null, 2));
    try {
      const screenshot = await call('Page.captureScreenshot', { format: 'png' });
      await writeFile(path.join(directory, 'screen-end.png'), Buffer.from(screenshot.data, 'base64'));
    } catch (error) { console.log(`Final screenshot unavailable: ${error.message}`); }
    console.log(`TV sampling complete: ${samples.length} samples, ${result.actualMs}ms, ${observedErrors.length} observed errors`);
  }
} finally {
  for (const request of pending.values()) clearTimeout(request.timer);
  socket.close();
  // Some TV Inspector builds do not complete the WebSocket close handshake.
  // Only our short-lived CLI process is stopped, after all evidence writes were awaited.
  setTimeout(() => process.exit(process.exitCode ?? 0), 1000).unref();
}
