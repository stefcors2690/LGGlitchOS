// Historical verifier for the former multi-section layout; not for the current Home.
// Manual browser acceptance check. No npm dependency: uses local Chrome + Node WebSocket.
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';

const baseUrl = process.env.SHELL_URL ?? 'http://127.0.0.1:5187';
const outputDir = process.env.VERIFY_OUTPUT ?? 'docs/verification/phase-1.8';
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
  for (const [width, height] of [[1920, 1080], [3840, 2160], [390, 844]]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await call('Page.navigate', { url: baseUrl });
    await waitReady('!!document.querySelector(".brand-logo img")?.complete && !!document.querySelector(".shell-footer")');
    await evaluate(`Promise.all([...document.querySelectorAll('.city-layer')].map(el => {
      const url = getComputedStyle(el).backgroundImage.slice(5,-2);
      const image = new Image(); image.src = url; return image.decode();
    })).then(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))`);
    await waitReady('document.querySelectorAll(".app-card").length === 7');
    const metrics = await evaluate(`(() => {
      const rect = element => { const r = element.getBoundingClientRect(); return { x:r.x, y:r.y, width:r.width, height:r.height, right:r.right, bottom:r.bottom }; };
      const shell = document.querySelector('.tv-shell');
      const image = document.querySelector('.brand-logo img');
      return {
        width:innerWidth, height:innerHeight,
        rail:rect(document.querySelector('.app-rail')),
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
    assert(!metrics.horizontalOverflow, 'Horizontal overflow: ' + JSON.stringify(await evaluate('[...document.querySelectorAll("body *")].filter(el => el.getBoundingClientRect().right > innerWidth + 1).map(el => ({tag:el.tagName,cls:el.className,right:el.getBoundingClientRect().right})).slice(0,20)')));
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
    await writeFile(`${outputDir}/shell-${width}x${height}.png`, Buffer.from(screenshot.data, 'base64'));
    results.push(metrics);
  }
  const headerChecks = {};
  await call('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await call('Page.navigate', { url: baseUrl });
  await waitReady('document.querySelectorAll(".section-link").length === 5');
  assert.deepEqual(await evaluate('[...document.querySelectorAll(".section-link")].map(el => el.textContent)'), ['Home', 'App', 'Ingressi', 'Domotica', 'Impostazioni']);
  await call('Page.bringToFront');
  await evaluate('document.querySelectorAll(".section-link")[1].focus()');
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 36 });
  await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await waitReady('document.querySelector(".section-link[aria-current]").textContent === "App"');
  assert.equal(await evaluate('document.querySelector("#scene-title").textContent'), 'Le tue applicazioni.');
  assert(await evaluate('document.activeElement.textContent === "App"'));
  headerChecks.keyboardSelectionRetainsFocus = true;
  for (let index = 0; index < 5; index++) {
    await evaluate(`document.querySelectorAll('.section-link')[${index}].click()`);
    await waitReady(`document.querySelectorAll('.section-link')[${index}].getAttribute('aria-current') === 'page'`);
    assert.equal(await evaluate('document.querySelectorAll(".section-link[aria-current]").length'), 1);
    assert(await evaluate('document.querySelector("#section-content").getAttribute("aria-labelledby") === "scene-title"'));
    assert(!(await evaluate('document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight')));
    if (index === 4) {
      await evaluate('document.activeElement.blur()');
      const shot = await call('Page.captureScreenshot', { format: 'png' });
      await writeFile(`${outputDir}/settings-1920x1080.png`, Buffer.from(shot.data, 'base64'));
    }
  }
  headerChecks.allFiveSections = true;
  headerChecks.clockMatchesBrowser = await evaluate(`(() => {
    const el = document.querySelector('.local-clock');
    return Math.abs(Date.now() - Date.parse(el.dateTime)) < 2500 &&
      document.querySelector('.clock-time').textContent === new Intl.DateTimeFormat('it-IT', {hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(el.dateTime));
  })()`);
  assert(headerChecks.clockMatchesBrowser);
  const clockBefore = await evaluate('document.querySelector(".local-clock").dateTime');
  await new Promise(resolve => setTimeout(resolve, 1200));
  assert.notEqual(await evaluate('document.querySelector(".local-clock").dateTime'), clockBefore);
  headerChecks.clockUpdates = true;
  const railChecks = {};
  await evaluate('document.querySelectorAll(".section-link")[0].click()');
  await waitReady('document.querySelector(".apps-section").hidden === false');
  await call('Page.bringToFront');
  await evaluate('document.querySelector(".app-card").focus()');
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 36 });
  await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await waitReady('document.querySelector(".rail-feedback").textContent.includes("Avvio simulato")');
  assert(await evaluate('document.activeElement.classList.contains("app-card")'));
  railChecks.keyboardLaunch = true;
  const launchShot = await call('Page.captureScreenshot', { format: 'png' });
  await writeFile(`${outputDir}/launch-demo-1920x1080.png`, Buffer.from(launchShot.data, 'base64'));
  await evaluate('document.querySelectorAll(".app-card")[3].focus()');
  await waitReady('document.querySelectorAll(".app-card")[3].getAttribute("aria-pressed") === "true"');
  await evaluate('document.querySelectorAll(".section-link")[4].click()');
  await waitReady('document.querySelector(".apps-section").hidden === true');
  await evaluate('document.querySelectorAll(".section-link")[1].click()');
  await waitReady('document.querySelector(".apps-section").hidden === false');
  assert.equal(await evaluate('document.querySelectorAll(".app-card")[3].getAttribute("aria-pressed")'), 'true');
  railChecks.selectionPreservedAcrossSections = true;
  assert.equal(await evaluate('document.querySelectorAll(".app-card").length'), 7);
  railChecks.cardCount = 7;
  const dpadChecks = {};
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await call('Page.navigate', { url: baseUrl });
  await waitReady('document.querySelectorAll(".app-card").length === 7');
  await call('Page.bringToFront');
  const key = async (name, autoRepeat = false) => {
    const code = {ArrowLeft:37,ArrowUp:38,ArrowRight:39,ArrowDown:40,Enter:13,Escape:27,Tab:9}[name] ?? 0;
    await call('Input.dispatchKeyEvent', {type:'keyDown',key:name,code:name,windowsVirtualKeyCode:code,autoRepeat,...(name === 'Enter' ? {text:'\r',nativeVirtualKeyCode:36} : {})});
    await call('Input.dispatchKeyEvent', {type:'keyUp',key:name,code:name,windowsVirtualKeyCode:code});
  };
  const activeId = () => evaluate('document.activeElement.dataset.tvId');
  await key('ArrowRight');
  assert.equal(await activeId(), 'nav-home');
  await key('ArrowRight');
  assert.equal(await activeId(), 'nav-apps');
  await key('Enter');
  await waitReady('document.querySelector(".section-link[aria-current]").textContent === "App"');
  await key('ArrowDown');
  assert.equal(await activeId(), 'app-demo-music');
  await evaluate('window.demoClicks = 0; document.querySelectorAll(".app-card").forEach(el => el.addEventListener("click", () => window.demoClicks++))');
  await key('Enter');
  await waitReady('document.querySelector(".rail-feedback").textContent.includes("Avvio simulato: Musica")');
  await key('Enter', true);
  assert.equal(await evaluate('window.demoClicks'), 1, 'Enter must activate once; auto-repeat must not launch again');
  await new Promise(resolve => setTimeout(resolve, 1200));
  assert.equal(await activeId(), 'app-demo-music', 'Clock and launch rerenders must retain focus');
  await key('ArrowUp');
  assert.equal(await activeId(), 'nav-apps');
  await key('ArrowDown');
  assert.equal(await activeId(), 'app-demo-music');
  for (let step = 0; step < 10; step++) await key('ArrowRight');
  assert.equal(await activeId(), 'app-demo-library');
  await key('ArrowRight');
  assert.equal(await activeId(), 'app-demo-library');
  await key('ArrowUp');
  assert.equal(await activeId(), 'nav-apps');
  for (let step = 0; step < 3; step++) await key('ArrowRight');
  await key('Enter');
  await waitReady('document.querySelector(".section-link[aria-current]").textContent === "Impostazioni"');
  await key('ArrowDown');
  assert.equal(await activeId(), 'settings-logo', 'Settings remain reachable while rail and motion control are unavailable');
  await key('Escape');
  await waitReady('document.querySelector(".section-link[aria-current]").textContent === "Home"');
  assert.equal(await activeId(), 'nav-home');
  dpadChecks.keyboardOnlyFlow = true;
  dpadChecks.nativeEnterOnceAndRepeatIgnored = true;
  dpadChecks.focusRetainedAcrossRerenders = true;
  dpadChecks.hiddenAndDisabledSkipped = true;
  dpadChecks.backReturnsHome = true;
  await key('ArrowDown');
  assert.equal(await activeId(), 'app-demo-library', 'Remembered rail position survives Back');
  // Programmatically hiding a focused region must recover to the selected header.
  await evaluate('document.querySelectorAll(".section-link")[4].click()');
  await waitReady('document.activeElement.dataset.tvId === "nav-settings"');
  dpadChecks.hiddenFocusRecovered = true;
  await key('Escape');
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await waitReady('!document.querySelector(".motion-toggle").disabled');
  await key('ArrowDown');
  assert.equal(await activeId(), 'background-motion');
  await key('ArrowDown');
  assert.equal(await activeId(), 'app-demo-library');
  await key('ArrowUp');
  assert.equal(await activeId(), 'background-motion');
  await key('ArrowUp');
  assert.equal(await activeId(), 'nav-home');
  dpadChecks.enabledMotionRowReachable = true;
  // Scoped OK aliases are browser events; no privileged remote hooks are used.
  await key('ArrowDown'); await key('ArrowDown');
  await evaluate('document.activeElement.dispatchEvent(new KeyboardEvent("keydown", {key:"OK",bubbles:true,cancelable:true}))');
  await waitReady('document.querySelector(".rail-feedback").textContent.includes("Avvio simulato: Libreria")');
  dpadChecks.okAlias = true;
  const focusShot = await call('Page.captureScreenshot', {format:'png'});
  await writeFile(`${outputDir}/dpad-focus-1920x1080.png`, Buffer.from(focusShot.data,'base64'));
  await key('Escape');
  await key('Tab');
  assert.equal(await activeId(), 'nav-apps', 'Native Tab must remain available');
  dpadChecks.nativeTabPreserved = true;
  await call('Emulation.setDeviceMetricsOverride', {width:390,height:844,deviceScaleFactor:1,mobile:false});
  await call('Emulation.setEmulatedMedia', {features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await call('Page.navigate', {url:baseUrl});
  await waitReady('document.querySelectorAll(".app-card").length === 7');
  await key('ArrowRight'); await key('ArrowDown');
  for (let step = 0; step < 8; step++) await key('ArrowRight');
  assert.equal(await activeId(), 'app-demo-library');
  assert(await evaluate('document.querySelector(".app-rail").scrollLeft > 0'));
  assert(await evaluate('document.documentElement.scrollWidth <= innerWidth'));
  assert(await evaluate(`(() => {const card=document.activeElement.getBoundingClientRect();const rail=document.querySelector('.app-rail').getBoundingClientRect();return card.right <= rail.right+8 && card.left >= rail.left-8;})()`));
  dpadChecks.narrowRailScrollsFocusedCardIntoView = true;
  const watchChecks = {};
  await call('Emulation.setDeviceMetricsOverride', {width:1920,height:1080,deviceScaleFactor:1,mobile:false});
  await key('ArrowDown');
  for (let step = 0; step < 6; step++) await key('ArrowLeft');
  assert.equal(await activeId(), 'watch-neon-district');
  assert(await evaluate('document.activeElement.getAttribute("aria-label").includes("Demo")'));
  const watchProgress = await evaluate('document.querySelector(".watch-progress").value / document.querySelector(".watch-progress").max');
  assert.equal(watchProgress, 0.475);
  await key('Enter');
  await waitReady('document.querySelector(".watch-feedback").textContent.includes("Ripresa simulata")');
  assert(await evaluate('document.querySelector(".watch-feedback").textContent.includes("Nessun video avviato")'));
  assert.equal(await activeId(), 'watch-neon-district');
  assert.equal(await evaluate('document.querySelector(".watch-progress").value / document.querySelector(".watch-progress").max'), watchProgress);
  const watchShot = await call('Page.captureScreenshot', {format:'png'});
  await writeFile(`${outputDir}/watch-resume-1920x1080.png`, Buffer.from(watchShot.data,'base64'));
  await key('ArrowUp');
  assert.equal(await activeId(), 'app-demo-library');
  await key('ArrowDown');
  assert.equal(await activeId(), 'watch-neon-district');
  await evaluate('document.querySelectorAll(".section-link")[1].click()');
  await waitReady('document.activeElement.dataset.tvId === "nav-apps"');
  assert(await evaluate('!document.querySelector(".watch-resume")'));
  watchChecks.keyboardResumeWithoutPlayback = true;
  watchChecks.demoProgressUnchanged = true;
  watchChecks.returnToRememberedRail = true;
  watchChecks.focusRecoveredOnLeavingHome = true;
  await key('Escape');
  const inputChecks = {};
  await waitReady('document.querySelectorAll(".input-button").length === 4');
  await key('ArrowDown');
  await key('ArrowDown');
  await key('ArrowRight');
  assert.equal(await activeId(), 'input-demo-hdmi-1');
  await key('ArrowRight');
  assert.equal(await activeId(), 'input-demo-hdmi-2');
  await key('Enter');
  await waitReady('document.querySelector(".input-feedback").textContent.includes("Cambio simulato")');
  assert(await evaluate('document.activeElement.getAttribute("aria-pressed") === "true"'));
  assert.equal(await evaluate('document.querySelectorAll(".input-button[aria-pressed=true]").length'), 1);
  await key('ArrowUp');
  assert.equal(await activeId(), 'app-demo-library');
  await key('ArrowDown');
  assert.equal(await activeId(), 'input-demo-hdmi-2');
  const inputShot = await call('Page.captureScreenshot', {format:'png'});
  await writeFile(`${outputDir}/input-selected-1920x1080.png`, Buffer.from(inputShot.data,'base64'));
  await evaluate('document.querySelectorAll(".section-link")[1].click()');
  await key('Escape');
  await waitReady('document.querySelector("[data-tv-id=input-demo-hdmi-2]")?.getAttribute("aria-pressed") === "true"');
  inputChecks.keyboardActivation = true;
  inputChecks.singleActiveSource = true;
  inputChecks.rememberedFocusAndRail = true;
  inputChecks.stateSurvivesSectionChange = true;
  const smartHomeChecks = {};
  await waitReady('document.querySelectorAll(".device-button").length === 2');
  await key('ArrowDown');
  await key('ArrowDown');
  for (let step = 0; step < 3; step++) await key('ArrowRight');
  assert.equal(await activeId(), 'device-demo-light');
  await key('Enter');
  await waitReady('document.activeElement.getAttribute("aria-checked") === "true"');
  assert(await evaluate('document.querySelector(".device-feedback").textContent.includes("Comando simulato")'));
  await key('Enter');
  await waitReady('document.activeElement.getAttribute("aria-checked") === "false"');
  await key('ArrowRight');
  assert.equal(await activeId(), 'device-demo-socket');
  await key('Enter');
  await waitReady('document.activeElement.getAttribute("aria-checked") === "true"');
  await key('ArrowRight');
  assert.equal(await activeId(), 'device-demo-socket');
  const smartShot = await call('Page.captureScreenshot', {format:'png'});
  await writeFile(`${outputDir}/smart-home-on-1920x1080.png`, Buffer.from(smartShot.data,'base64'));
  await key('ArrowUp');
  assert.equal(await activeId(), 'app-demo-library');
  await key('ArrowDown');
  assert.equal(await activeId(), 'device-demo-socket');
  await evaluate('document.querySelectorAll(".section-link")[1].click()');
  await waitReady('document.activeElement.dataset.tvId === "nav-apps"');
  await key('Escape');
  await waitReady('document.querySelector("[data-tv-id=device-demo-socket]")?.getAttribute("aria-checked") === "true"');
  smartHomeChecks.keyboardOnOff = true;
  smartHomeChecks.focusMemoryAndBoundary = true;
  smartHomeChecks.stateSurvivesSectionChange = true;
  const motionChecks = {};
  await call('Emulation.setEmulatedMedia', { features: [{name:'prefers-reduced-motion',value:'no-preference'}] });
  await evaluate('document.querySelectorAll(".section-link")[4].click()');
  await waitReady('!!document.querySelector("[data-tv-id=settings-reduced]")');
  await evaluate('document.querySelector("[data-tv-id=settings-reduced]").focus()');
  await key('Enter');
  await waitReady('document.querySelector(".tv-shell").dataset.motionReduced === "true"');
  assert.equal(await evaluate('document.querySelector(".city-backdrop").dataset.motion'), 'still');
  assert(await evaluate('document.querySelector(".brand-logo img").currentSrc.startsWith("data:image/svg+xml,")'));
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".section-link")).transitionDuration'), '0s');
  await call('Page.reload');
  await waitReady('document.querySelector(".tv-shell")?.dataset.motionReduced === "true"');
  await evaluate('document.querySelectorAll(".section-link")[4].click()');
  await evaluate('document.querySelector("[data-tv-id=settings-reduced]").focus()');
  await key('Enter');
  await waitReady('document.querySelector(".tv-shell").dataset.motionReduced === "false"');
  await key('ArrowRight');
  assert.equal(await activeId(), 'settings-logo');
  await key('Enter');
  await waitReady('document.querySelector(".brand-logo img").dataset.motion === "still"');
  assert.equal(await evaluate('document.querySelector(".city-backdrop").dataset.motion'), 'running');
  await key('Enter');
  await waitReady('document.querySelector(".brand-logo img").dataset.motion === "animated"');
  await call('Emulation.setEmulatedMedia', { features: [{name:'prefers-reduced-motion',value:'reduce'}] });
  await waitReady('document.querySelector(".tv-shell").dataset.motionReduced === "true"');
  assert.equal(await evaluate('document.querySelector(".brand-logo img").dataset.motion'), 'still');
  const motionShot = await call('Page.captureScreenshot', {format:'png'});
  await writeFile(`${outputDir}/motion-settings-1920x1080.png`, Buffer.from(motionShot.data,'base64'));
  motionChecks.userReductionAndPersistence = true;
  motionChecks.independentLogo = true;
  motionChecks.systemPrecedenceAndLiveUpdate = true;
  motionChecks.transitionsDisabled = true;
  await evaluate('localStorage.removeItem("glitchos.motion.v1")');
  const cityChecks = {};
  await call('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await call('Page.navigate', { url: baseUrl });
  await waitReady('!!document.querySelector(".city-backdrop")');
  assert.equal(await evaluate('document.querySelector(".city-backdrop").dataset.motion'), 'still');
  assert(await evaluate('document.querySelector(".motion-toggle").disabled'));
  assert(await evaluate('[...document.querySelector(".city-backdrop").getAnimations({subtree:true})].every(a => a.playState !== "running")'));
  cityChecks.reducedMotion = true;
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await waitReady('document.querySelector(".city-backdrop").dataset.motion === "running"');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".city-backdrop")).pointerEvents'), 'none');
  const cityAssets = await evaluate(`Promise.all([...document.querySelectorAll('.city-layer,.city-shuttle')].map(el => {
    const url = getComputedStyle(el).backgroundImage.slice(5,-2);
    return new Promise(resolve => { const img = new Image(); img.onload = () => resolve(img.naturalWidth > 0); img.onerror = () => resolve(false); img.src = url; });
  }))`);
  assert(cityAssets.every(Boolean), 'City assets failed to decode');
  cityChecks.assetsLoaded = cityAssets;
  assert(await evaluate('getComputedStyle(document.querySelector(".city-image")).backgroundImage.includes("background-")'), 'Build must use the supplied background PNG');
  cityChecks.primaryBackground = 'user-provided PNG';
  const timelineBefore = await evaluate('document.querySelector(".city-flight").getAnimations()[0].currentTime');
  await new Promise(resolve => setTimeout(resolve, 350));
  const timelineAfter = await evaluate('document.querySelector(".city-flight").getAnimations()[0].currentTime');
  assert(timelineAfter > timelineBefore, 'Shuttle timeline must advance');
  cityChecks.shuttleTimelineAdvances = true;
  // Activate the pause control with an actual keyboard Enter event.
  await call('Page.bringToFront');
  await evaluate('document.querySelector(".motion-toggle").focus()');
  assert(await evaluate('document.activeElement === document.querySelector(".motion-toggle")'));
  assert(!(await evaluate('document.querySelector(".motion-toggle").disabled')));
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 36 });
  await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await waitReady('document.querySelector(".city-backdrop").dataset.motion === "still"');
  assert(await evaluate('[...document.querySelector(".city-backdrop").getAnimations({subtree:true})].every(a => a.playState === "paused")'));
  cityChecks.keyboardPause = true;
  await evaluate('document.querySelector(".motion-toggle").click()');
  await waitReady('document.querySelector(".city-backdrop").dataset.motion === "running"');
  // Emulate the hidden property and dispatch the browser event to exercise subscription.
  await evaluate('Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange"))');
  await waitReady('document.querySelector(".city-backdrop").dataset.motion === "still"');
  await evaluate('delete document.hidden; document.dispatchEvent(new Event("visibilitychange"))');
  await waitReady('document.querySelector(".city-backdrop").dataset.motion === "running"');
  cityChecks.visibilityEventPauseResume = true;
  // Sample both original crafts during their flight windows, without waiting a full quiet cycle.
  await evaluate(`document.querySelector('.motion-toggle').blur();
    document.querySelectorAll('.city-backdrop').forEach(el => el.getAnimations({subtree:true}).forEach(a => {
      a.pause(); const timing = a.effect.getTiming();
      a.currentTime = Number(timing.delay) + Number(timing.duration) * (timing.direction === 'reverse' ? 1.2 : 1.8);
    }));`);
  const sampledFlights = await evaluate('[...document.querySelectorAll(".city-flight")].map(el => ({ opacity: getComputedStyle(el).opacity, animations: el.getAnimations().map(a => ({time:a.currentTime, timing:a.effect.getTiming(), computed:a.effect.getComputedTiming()})) }))');
  assert(sampledFlights.every(flight => Number(flight.opacity) > 0.5), JSON.stringify(sampledFlights));
  cityChecks.bothFlightWindowsVisible = true;
  const flightShot = await call('Page.captureScreenshot', { format: 'png' });
  await writeFile(`${outputDir}/city-flight-1920x1080.png`, Buffer.from(flightShot.data, 'base64'));
  // Verify all city images can fail while the base gradient and semantic UI remain.
  await evaluate(`document.querySelectorAll('.city-layer,.city-shuttle').forEach(el => el.style.backgroundImage = 'url("/missing-city-fallback.svg")')`);
  assert(await evaluate('getComputedStyle(document.querySelector(".city-backdrop")).backgroundImage.includes("linear-gradient")'));
  assert(await evaluate('!!document.querySelector(".shell-main h2")'));
  cityChecks.gradientFallback = true;
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
  await writeFile(`${outputDir}/shell-metrics.json`, JSON.stringify({ baseUrl, motionChecks, smartHomeChecks, inputChecks, watchChecks, dpadChecks, railChecks, headerChecks, cityChecks, results: results.map(({ source, currentSource, ...metrics }) => ({ ...metrics, canonicalSource: source.startsWith('data:') ? 'bundled data URI' : source, stillSourceSelected: currentSource.startsWith('data:image/svg+xml,') })), svgAnimation: { reducedMotion: 'none', normal: 'shake', elapsedMs: after - before } }, null, 2) + '\n');
  console.log('Shell acceptance passed: 1080p, 4K, mobile fallback, logo, city motion, keyboard pause and reduced-motion SVG.');
} finally {
  socket?.close();
  chrome.kill();
  await new Promise(resolve => chrome.once('exit', resolve));
  await rm(profile, { recursive: true, force: true });
}
