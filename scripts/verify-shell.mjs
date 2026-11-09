// Manual browser acceptance check. No npm dependency: uses local Chrome + Node WebSocket.
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';

const baseUrl = process.env.SHELL_URL ?? 'http://127.0.0.1:5187';
const outputDir = process.env.VERIFY_OUTPUT ?? 'docs/verification/fixed-motion';
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
  await mkdir(outputDir, { recursive: true });
  const results = [];
  const key = async name => {
    await call('Input.dispatchKeyEvent', {type:'keyDown',key:name,code:name,...(name === 'Enter' ? {text:'\r',unmodifiedText:'\r'} : {}),windowsVirtualKeyCode:{Enter:13,Escape:27}[name] ?? 0});
    await call('Input.dispatchKeyEvent', {type:'keyUp',key:name,code:name});
  };
  const activeId = () => evaluate('document.activeElement.dataset.tvId');
  for (const [width,height] of [[1920,1080],[3840,2160],[390,844]]) {
    await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
    await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await call('Page.navigate',{url:baseUrl});
    await waitReady('document.querySelectorAll(".input-button").length === 4 && document.querySelectorAll(".device-button").length === 2');
    await evaluate(`Promise.all([...document.querySelectorAll('.city-layer')].map(el => {const img=new Image();img.src=getComputedStyle(el).backgroundImage.slice(5,-2);return img.decode();}))`);
    assert.equal(await evaluate('document.querySelectorAll(".section-nav").length'),0);
    const metrics = await evaluate('({width:innerWidth,height:innerHeight,horizontal:document.documentElement.scrollWidth>innerWidth,vertical:document.documentElement.scrollHeight>innerHeight})');
    assert(!metrics.horizontal);
    if(width>=1920) assert(!metrics.vertical);
    results.push(metrics);
    const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});
    await writeFile(`${outputDir}/shell-${width}x${height}.png`,Buffer.from(shot.data,'base64'));
  }
  await call('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate',{url:baseUrl});
  await waitReady('document.querySelectorAll(".device-button").length === 2');
  await key('ArrowRight');
  assert.equal(await activeId(),'app-demo-cinema');
  await key('ArrowDown');
  assert.equal(await activeId(),'watch-neon-district');
  await key('ArrowRight'); await key('ArrowRight'); await key('Enter');
  await waitReady('document.querySelector("[data-tv-id=input-demo-hdmi-2]").getAttribute("aria-pressed") === "true"');
  for(let i=0;i<3;i++) await key('ArrowRight');
  assert.equal(await activeId(),'device-demo-light');
  await key('Enter');
  await waitReady('document.activeElement.getAttribute("aria-checked") === "true"');
  await key('Escape');
  assert.equal(await activeId(),'app-demo-cinema');
  await key('ArrowUp');
  assert.equal(await activeId(),'app-demo-cinema');
  assert.equal(await evaluate('document.querySelectorAll(".motion-toggle,.motion-disclosure").length'),0);
  await evaluate('localStorage.setItem("glitchos.motion.v1",JSON.stringify({reduced:true,logo:false}))');
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await call('Page.reload');
  await waitReady('document.querySelector(".city-backdrop")?.dataset.motion === "running"');
  assert.equal(await evaluate('document.querySelector(".brand-logo img").dataset.motion'),'animated');
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await waitReady('document.querySelector(".city-backdrop").dataset.motion === "still"');
  assert.equal(await evaluate('document.querySelector(".brand-logo img").dataset.motion'),'still');
  await evaluate('localStorage.removeItem("glitchos.motion.v1")');
  await writeFile(`${outputDir}/shell-metrics.json`,JSON.stringify({results,onePage:true,keyboardWidgets:true,fixedMotionIgnoresStorage:true,systemReducedMotion:true},null,2));
  console.log('One-page Home acceptance passed: layout, widgets, fixed motion and Back.');
} finally {
  socket?.close();
  chrome.kill();
  await new Promise(resolve => chrome.once('exit', resolve));
  await rm(profile, { recursive: true, force: true });
}
