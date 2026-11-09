// Manual browser acceptance check. No npm dependency: uses local Chrome + Node WebSocket.
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';

const baseUrl = process.env.SHELL_URL ?? 'http://127.0.0.1:5187';
const outputDir = process.env.VERIFY_OUTPUT ?? `docs/verification/browser-${new Date().toISOString().replace(/[:.]/g, '-')}`;
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
  const runtimeErrors = [];
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === "Runtime.exceptionThrown") runtimeErrors.push(message.params.exceptionDetails.text);
    if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") runtimeErrors.push("console.error");
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
  await call('Runtime.enable');
  const waitReady = async expression => {
    for (let retry = 0; retry < 100; retry++) {
      if (await evaluate(expression)) return;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error(`Page did not become ready: ${expression}`);
  };
  const reloadPage = async () => {
    const previous = await evaluate('performance.timeOrigin');
    await call('Page.reload');
    await waitReady(`performance.timeOrigin !== ${previous} && document.readyState === "complete"`);
  };
  await mkdir(outputDir, { recursive: true });
  const verifyNeonMapping = async () => {
    await waitReady('document.querySelectorAll(".neon-region").length === 7');
    const mappingError = `(() => {
      const img=document.querySelector('.background-image');const root=document.querySelector('.background-neon').getBoundingClientRect();
      const scale=Math.max(root.width/img.naturalWidth,root.height/img.naturalHeight);
      const w=img.naturalWidth*scale,h=img.naturalHeight*scale;
      const sign=document.querySelector('[data-neon-id="tower-07"]').getBoundingClientRect();
      return Math.max(Math.abs(sign.left-root.left-((root.width-w)/2+.379*w)),Math.abs(sign.top-root.top-((root.height-h)/2+.325*h)),Math.abs(sign.width-.047*w));
    })()`;
    await waitReady(`(${mappingError}) < 1`);
    assert(await evaluate(mappingError) < 1,'Neon must follow image cover coordinates');
  };
  const verifyHologramMapping = async () => {
    await waitReady('!!document.querySelector(".hologram-panel")');
    const expr = `(() => {
      const root=document.querySelector('.background-hologram').getBoundingClientRect();
      const image=document.querySelector('.background-image');
      const scale=Math.max(root.width/image.naturalWidth,root.height/image.naturalHeight);
      const w=image.naturalWidth*scale,h=image.naturalHeight*scale;
      const el=document.querySelector('.hologram-panel');const panel=el.getBoundingClientRect(),style=getComputedStyle(el);
      const hidden=style.display === 'none';
      const x=hidden?parseFloat(style.left):panel.left-root.left;
      const y=hidden?parseFloat(style.top):panel.top-root.top;
      const width=hidden?parseFloat(style.width):panel.width;
      return Math.max(Math.abs(x-((root.width-w)/2+.773*w)),Math.abs(y-((root.height-h)/2+.015*h)),Math.abs(width-.11*w));
    })()`;
    await waitReady(`(${expr}) < 1`);
    assert(await evaluate('getComputedStyle(document.querySelector(".hologram-panel")).clipPath.startsWith("polygon(")'));
  };
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
    await evaluate('document.querySelector(".background-image").decode()');
    await verifyNeonMapping();
    await verifyHologramMapping();
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
  // Test-only instrumentation: identify cached 32x32 particle sprites without app hooks.
  const particleProbe = await call('Page.addScriptToEvaluateOnNewDocument',{source:`
    window.__particleProbe={draws:0,lastX:0,lastY:0,skipRain:false};
    const originalDraw=CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage=function(...args){
      const sprite=args[0],probe=window.__particleProbe;
      if(sprite instanceof HTMLCanvasElement && sprite.width===32 && sprite.height===32){
        probe.draws++;probe.lastX=args[1];probe.lastY=args[2];
      }
      if(probe.skipRain && sprite instanceof HTMLCanvasElement && sprite.width===32 && sprite.height===96)return;
      return originalDraw.apply(this,args);
    };
  `});
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await reloadPage();
  await waitReady('document.querySelector(".cyberpunk-background")?.dataset.motion === "allowed"');
  assert.equal(await evaluate('document.querySelector(".brand-logo img").dataset.motion'),'animated');
  await waitReady('document.querySelector(".background-rain")?.dataset.state === "running"');
  await waitReady('document.querySelector(".background-fog")?.dataset.motion === "running"');
  assert.equal(await evaluate('document.querySelectorAll(".background-fog").length'),1);
  assert.equal(await evaluate('document.querySelectorAll(".city-fog").length'),0);
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".background-fog")).pointerEvents'),'none');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".fog-veil-near")).filter'),'none');
  await verifyNeonMapping();
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".background-neon")).pointerEvents'),'none');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".neon-light")).filter'),'none');
  await waitReady('document.querySelector(".neon-light").getAnimations()[0]?.currentTime > 250');
  const neonBefore = await evaluate('getComputedStyle(document.querySelector(".neon-light")).opacity');
  await new Promise(resolve => setTimeout(resolve, 350));
  assert.notEqual(await evaluate('getComputedStyle(document.querySelector(".neon-light")).opacity'),neonBefore);
  const neonPulseRange = await evaluate(`(() => {
    const el=document.querySelector('.neon-light');const a=el.getAnimations()[0];const saved=a.currentTime;
    const duration=Number(a.effect.getTiming().duration);const delay=Number(a.effect.getTiming().delay);
    a.currentTime=Math.max(0,delay);const low=Number(getComputedStyle(el).opacity);
    a.currentTime=delay+duration;const high=Number(getComputedStyle(el).opacity);
    a.currentTime=saved;return {low,high,duration};
  })()`);
  assert(neonPulseRange.high > .95 && neonPulseRange.low < .15 && neonPulseRange.duration >= 3000);
  const neonTimes = await evaluate(`[...document.querySelectorAll('.neon-light')].map(el => {
    const a=el.getAnimations()[0];const saved=a.currentTime;
    a.currentTime=Number(a.effect.getTiming().delay)+Number(a.effect.getTiming().duration);return saved;
  })`);
  const neonPeakShot=await call('Page.captureScreenshot',{format:'png'});
  await writeFile(`${outputDir}/neon-peak-1920x1080.png`,Buffer.from(neonPeakShot.data,'base64'));
  await evaluate(`[...document.querySelectorAll('.neon-light')].forEach((el,i) => {el.getAnimations()[0].currentTime=${JSON.stringify(neonTimes)}[i];})`);
  const neonSample = await evaluate(`(() => {
    const el=document.querySelector('.neon-region');const a=el.getAnimations()[0];const saved=a.currentTime;
    const duration=Number(a.effect.getTiming().duration);const delay=Number(a.effect.getTiming().delay);
    a.currentTime=delay+duration*.712;const dim=Number(getComputedStyle(el).opacity);
    a.currentTime=delay+duration*.5;const normal=Number(getComputedStyle(el).opacity);
    a.currentTime=saved;return {dim,normal};
  })()`);
  assert(neonSample.dim > neonSample.normal*.8 && neonSample.dim < neonSample.normal,'Interference is only a shallow dim');
  await verifyHologramMapping();
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".background-hologram")).pointerEvents'),'none');
  const scanBefore = await evaluate('document.querySelector(".hologram-sweep").getAnimations()[0].currentTime');
  await new Promise(resolve => setTimeout(resolve, 200));
  assert(await evaluate('document.querySelector(".hologram-sweep").getAnimations()[0].currentTime') > scanBefore);
  await evaluate(`(() => {const s=document.createElement('style');s.id='holo-test-pause';s.textContent='.hologram-panel > * {animation-play-state:paused!important}';document.head.append(s);})()`);
  const holoSample = await evaluate(`(() => {
    const el=document.querySelector('.hologram-red');const a=el.getAnimations()[0];const saved=a.currentTime;
    a.currentTime=Number(a.effect.getTiming().duration)*.95;
    const style=getComputedStyle(el); const sample={opacity:Number(style.opacity),transform:style.transform,filter:style.filter};
    return {sample,saved};
  })()`);
  assert(holoSample.sample.opacity > .1 && holoSample.sample.opacity <= .2);
  assert(holoSample.sample.filter.includes('hologram-'));
  const sliceTime = await evaluate(`(() => {const a=document.querySelector('.hologram-slice-one').getAnimations()[0];const saved=a.currentTime;a.currentTime=Number(a.effect.getTiming().duration)*.94;return saved;})()`);
  const holoShot = await call('Page.captureScreenshot',{format:'png'});
  await writeFile(`${outputDir}/hologram-interference-1920x1080.png`,Buffer.from(holoShot.data,'base64'));
  await evaluate(`document.querySelector('.hologram-red').getAnimations()[0].currentTime=${holoSample.saved};document.querySelector('.hologram-slice-one').getAnimations()[0].currentTime=${sliceTime};`);
  await evaluate('document.querySelector("#holo-test-pause").remove()');
  const fogStart = await evaluate('document.querySelector(".fog-veil-near").getAnimations()[0].currentTime');
  await new Promise(resolve => setTimeout(resolve, 250));
  assert(await evaluate('document.querySelector(".fog-veil-near").getAnimations()[0].currentTime') > fogStart);
  const fogBoundary = await evaluate(`(() => {
    const el=document.querySelector('.fog-veil-near'); const a=el.getAnimations()[0];
    const savedTime=a.currentTime; const duration=Number(a.effect.getTiming().duration); const delay=Number(a.effect.getTiming().delay);
    a.currentTime=delay+duration-1; const before=getComputedStyle(el).transform;
    a.currentTime=delay+duration+1; const after=getComputedStyle(el).transform;
    a.currentTime=savedTime; return {before,after};
  })()`);
  assert.equal(fogBoundary.before,fogBoundary.after,'Alternate fog cycle must be continuous');
  const particlePool = await evaluate(`({count:Number(document.querySelector('.background-effects').dataset.particleCount), canvases:document.querySelectorAll('.background-effects').length,pointerEvents:getComputedStyle(document.querySelector('.background-effects')).pointerEvents})`);
  assert.deepEqual(particlePool, {count:40,canvases:1,pointerEvents:'none'});
  await waitReady('window.__particleProbe.draws >= 80');
  const particleBefore = await evaluate('({...window.__particleProbe})');
  await evaluate('window.__particleProbe.skipRain=true');
  await new Promise(resolve => setTimeout(resolve, 200));
  const particleAfter = await evaluate('({...window.__particleProbe})');
  assert(particleAfter.draws > particleBefore.draws);
  assert.notEqual(particleAfter.lastX,particleBefore.lastX,'Particle positions must advance independently');
  const particleCoverage = await evaluate(`(() => {
    const c=document.querySelector('.background-effects'),p=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
    let visible=0,peak=0;for(let i=3;i<p.length;i+=4){if(p[i]>=20)visible++;peak=Math.max(peak,p[i]);}
    return {visible,peak};
  })()`);
  assert(particleCoverage.visible > 40 && particleCoverage.peak > 40,'Particles must have visible luminous cores');
  const particleShot = await call('Page.captureScreenshot',{format:'png'});
  await writeFile(`${outputDir}/particles-only-1920x1080.png`,Buffer.from(particleShot.data,'base64'));
  await evaluate('window.__particleProbe.skipRain=false');
  await new Promise(resolve => setTimeout(resolve, 100));
  const rainBefore = await evaluate('document.querySelector(".background-rain").toDataURL()');
  await new Promise(resolve => setTimeout(resolve, 250));
  const rainAfter = await evaluate('document.querySelector(".background-rain").toDataURL()');
  assert.notEqual(rainBefore, rainAfter, 'Rain pixels must move');
  const rainCoverage = await evaluate(`(() => {
    const c=document.querySelector('.background-rain'); const p=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
    let visible=0, peak=0; for(let i=3;i<p.length;i+=4) { if(p[i]>=20) visible++; if(p[i]>peak) peak=p[i]; }
    return {visible,peak};
  })()`);
  assert(rainCoverage.peak >= 60 && rainCoverage.visible > 300, 'Rain needs perceptible trails, not only changing pixels');
  const rainShot = await call('Page.captureScreenshot',{format:'png'});
  await writeFile(`${outputDir}/rain-1920x1080.png`,Buffer.from(rainShot.data,'base64'));
  await key('ArrowRight');
  const focusedDuringRain = await activeId();
  await new Promise(resolve => setTimeout(resolve, 1000));
  assert.equal(await activeId(),focusedDuringRain);
  await call('Emulation.setDeviceMetricsOverride',{width:3840,height:2160,deviceScaleFactor:2,mobile:false});
  await waitReady('document.querySelector(".background-rain").width === 1920');
  assert.equal(await evaluate('document.querySelector(".background-rain").height'),1080);
  await verifyNeonMapping();
  await verifyHologramMapping();
  const rain4k = await call('Page.captureScreenshot',{format:'png'});
  await writeFile(`${outputDir}/rain-3840x2160.png`,Buffer.from(rain4k.data,'base64'));
  await call('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
  await evaluate('Object.defineProperty(document,"hidden",{configurable:true,value:true});document.dispatchEvent(new Event("visibilitychange"))');
  await waitReady('document.querySelector(".background-rain").dataset.state === "static"');
  assert(Number(await evaluate('document.querySelector(".background-rain").dataset.frames')) > 0);
  assert(await evaluate('[...document.querySelectorAll(".fog-veil")].every(el => getComputedStyle(el).animationPlayState === "paused")'));
  assert.equal(await evaluate('document.querySelector(".background-neon").dataset.motion'),'still');
  assert.equal(await evaluate('document.querySelector(".background-hologram").dataset.motion'),'still');
  assert(await evaluate('getComputedStyle(document.querySelector(".hologram-panel")).visibility === "hidden" || getComputedStyle(document.querySelector(".hologram-panel")).display === "none"'));
  await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
  const fogPaused = await evaluate('document.querySelector(".fog-veil-near").getAnimations()[0].currentTime');
  await new Promise(resolve => setTimeout(resolve, 150));
  const fogPausedAfter = await evaluate('document.querySelector(".fog-veil-near").getAnimations()[0].currentTime');
  assert(Math.abs(fogPausedAfter-fogPaused)<40,'Hidden fog timeline stays paused');

  await evaluate('delete document.hidden;document.dispatchEvent(new Event("visibilitychange"))');
  await waitReady('document.querySelector(".background-rain").dataset.state === "running"');
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await waitReady('document.querySelector(".cyberpunk-background").dataset.motion === "still"');
  assert.equal(await evaluate('document.querySelector(".brand-logo img").dataset.motion'),'still');
  assert.equal(await evaluate('document.querySelector(".background-fog").dataset.motion'),'still');
  assert(await evaluate('[...document.querySelectorAll(".fog-veil")].every(el => getComputedStyle(el).animationPlayState === "paused")'));
  assert.equal(await evaluate('document.querySelector(".background-neon").dataset.motion'),'still');
  assert.equal(await evaluate('document.querySelector(".background-hologram").dataset.motion'),'still');
  assert(await evaluate('getComputedStyle(document.querySelector(".hologram-panel")).visibility === "hidden" || getComputedStyle(document.querySelector(".hologram-panel")).display === "none"'));
  await evaluate('localStorage.removeItem("glitchos.motion.v1")');
  assert.equal(await evaluate('document.querySelector(".cyberpunk-background").dataset.renderer'),'static');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".background-image")).objectFit'),'cover');
  assert.equal(await evaluate('document.querySelectorAll("video,.city-rain,.city-flight").length'),0);
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".background-image-layer")).pointerEvents'),'none');
  assert.equal(await evaluate('document.querySelector(".background-rain").dataset.state'),'static');
  const stoppedDraws = await evaluate('window.__particleProbe.draws');
  await new Promise(resolve => setTimeout(resolve, 150));
  assert.equal(await evaluate('window.__particleProbe.draws'),stoppedDraws,'Reduced motion must stop particle draws');
  await call('Page.removeScriptToEvaluateOnNewDocument',{identifier:particleProbe.identifier});
  const noCanvas = await call('Page.addScriptToEvaluateOnNewDocument',{source:'HTMLCanvasElement.prototype.getContext = function(){return null;}'});
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await reloadPage();
  await waitReady('document.querySelector(".background-rain")?.dataset.state === "unavailable"');
  await evaluate('document.querySelector(".background-image").decode()');
  assert(await evaluate('document.querySelector(".background-image").naturalWidth > 0'));
  await key('ArrowRight');assert.equal(await activeId(),'app-demo-cinema');
  await key('ArrowDown');assert.equal(await activeId(),'watch-neon-district');
  await key('Enter');await waitReady('document.querySelector(".watch-feedback").textContent.includes("Ripresa simulata")');
  await key('Escape');assert.equal(await activeId(),'app-demo-cinema');
  await call('Page.removeScriptToEvaluateOnNewDocument',{identifier:noCanvas.identifier});
  await evaluate('document.querySelector(".background-image").src = "/deliberately-missing-background.png"');
  await waitReady('!!document.querySelector(".background-notice")');
  await waitReady('!document.querySelector(".background-neon") && !document.querySelector(".background-hologram")');
  assert(await evaluate('!!document.querySelector(".background-gradient") && !document.querySelector(".background-image")'));
  await key('Escape');
  assert.equal(await activeId(),'app-demo-cinema');
  const fallbackShot = await call('Page.captureScreenshot',{format:'png'});
  await writeFile(`${outputDir}/missing-image-fallback.png`,Buffer.from(fallbackShot.data,'base64'));
  let profiles = null;
  if (process.env.PROFILE_TEST_URL) {
    await call('Page.navigate',{url:process.env.PROFILE_TEST_URL});
    await waitReady('!!document.querySelector("#profile-cinematic")');
    await waitReady('document.querySelector(".background-effects")?.dataset.state === "running"');
    await evaluate('document.querySelector(".background-image").decode()');
    await waitReady('document.querySelectorAll(".neon-region").length===7 && !!document.querySelector(".hologram-panel")');
    await evaluate('window.__originalImage=document.querySelector(".background-image");void 0');
    const resources = () => evaluate(`(() => {
      const r=window.__backgroundResources,c=document.querySelector('.background-effects');
      return {raf:r.frames.size,resize:r.resize.size,observers:r.observers.size,
        sprites:[...r.sprites].filter(s=>s.width>0).length,canvases:document.querySelectorAll('.background-effects').length,
        rain:Number(c?.dataset.rainCount??0),particles:Number(c?.dataset.particleCount??0),
        sameImage:window.__originalImage===document.querySelector('.background-image')};
    })()`);
    const baseline = await resources();
    assert.equal(baseline.raf,1);assert.equal(baseline.sprites,5);assert.equal(baseline.rain,208);assert.equal(baseline.particles,40);
    await waitReady('Number(document.querySelector(".background-effects").dataset.fps)>0');
    const monitor = await evaluate('JSON.parse(document.querySelector("#performance-sample").textContent)');
    assert(monitor.windowMs>=2000 && monitor.fps>0 && monitor.fps<=31 && monitor.averageDrawMs>=0);
    const transitions=[];
    for (const profile of ['cinematic','eco','balanced','cinematic','balanced']) {
      await evaluate(`document.querySelector('#profile-${profile}').click()`);
      await waitReady(`document.querySelector('.cyberpunk-background')?.dataset.profile === '${profile}'`);
      if(profile!=='eco') await waitReady(`Number(document.querySelector('.background-effects')?.dataset.rainCount)===${profile==='cinematic'?291:208}`);
      const current=await resources();transitions.push({profile,...current});
      assert(current.sameImage,'Switching profile must preserve the original img node');
      if(profile==='eco') {
        assert.deepEqual({...current,sameImage:undefined},{raf:0,resize:0,observers:0,sprites:0,canvases:0,rain:0,particles:0,sameImage:undefined});
        assert.equal(await evaluate('document.querySelectorAll(".background-neon,.background-hologram,.background-fog").length'),0);
      } else {
        assert.equal(current.raf,1);assert.equal(current.sprites,5);assert.equal(current.canvases,1);
        assert.equal(current.resize,baseline.resize);assert.equal(current.observers,baseline.observers);
        assert.equal(current.rain,profile==='cinematic'?291:208);assert.equal(current.particles,profile==='cinematic'?80:40);
      }
      if(profile==='eco'||profile==='cinematic') {
        const shot=await call('Page.captureScreenshot',{format:'png'});
        await writeFile(`${outputDir}/profile-${profile}.png`,Buffer.from(shot.data,'base64'));
      }
    }
    await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await waitReady('document.querySelector(".background-effects")?.dataset.state === "static"');
    const reduced=await resources();assert.equal(reduced.raf,0);assert.equal(reduced.sprites,0);
    await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
    await waitReady('document.querySelector(".background-effects")?.dataset.state === "running"');
    await evaluate('document.querySelector("#toggle-engine").click()');
    await waitReady('!document.querySelector(".cyberpunk-background")');
    const unmounted=await resources();assert.equal(unmounted.raf,0);assert.equal(unmounted.resize,0);assert.equal(unmounted.observers,0);assert.equal(unmounted.sprites,0);
    await evaluate('document.querySelector("#toggle-engine").click()');
    await waitReady('document.querySelector(".background-effects")?.dataset.state === "running"');
    const remounted=await resources();assert.equal(remounted.raf,1);assert.equal(remounted.resize,baseline.resize);assert.equal(remounted.observers,baseline.observers);
    // Unmount deliberately replaced the img: subsequent checks compare against the new mount.
    await evaluate('window.__originalImage=document.querySelector(".background-image");void 0');
    const fallbackChecks=[];
    for (const mode of ['contextlost','draw-error']) {
      await evaluate(`(() => {
        const canvas=document.querySelector('.background-effects');window.__failedCanvas=canvas;
        if('${mode}'==='contextlost') canvas.dispatchEvent(new Event('contextlost',{cancelable:true}));
        else {const context=canvas.getContext('2d'),clear=context.clearRect;window.__restoreClear=()=>{context.clearRect=clear;};context.clearRect=()=>{throw new Error('Injected draw/cleanup failure');};}
      })()`);
      await waitReady('document.querySelector(".background-effects")?.dataset.state==="unavailable"');
      const failed=await resources();fallbackChecks.push({mode,...failed});
      assert.equal(failed.raf,0);assert.equal(failed.sprites,0);assert.equal(failed.resize,2);assert.equal(failed.observers,2);
      await evaluate('window.dispatchEvent(new Event("resize"))');
      await new Promise(resolve=>setTimeout(resolve,100));
      assert(await evaluate('window.__failedCanvas.width===1 && window.__failedCanvas.height===1'),'Failed buffer must stay released after resize');
      assert(await evaluate('document.querySelector(".background-image").naturalWidth>0'),'PNG must survive Canvas failure');
      await evaluate('window.__restoreClear?.();delete window.__restoreClear');
      await evaluate("document.querySelector('#profile-cinematic').click()");
      await waitReady('document.querySelector(".background-effects")?.dataset.state==="running"');
      await evaluate("document.querySelector('#profile-balanced').click()");
      await waitReady('document.querySelector(".background-effects")?.dataset.rainCount==="208" && document.querySelector(".background-effects")?.dataset.state==="running"');
      const recovered=await resources();assert.equal(recovered.raf,1);assert.equal(recovered.sprites,5);
    }
    const disabledChecks=[];
    for(const id of ['toggle-effects','toggle-scene']) {
      await evaluate(`document.querySelector('#${id}').click()`);
      await waitReady('!document.querySelector(".background-effects")');
      const disabled=await resources();disabledChecks.push({id,...disabled});
      assert.equal(disabled.raf,0);assert.equal(disabled.sprites,0);assert.equal(disabled.resize,0);assert.equal(disabled.observers,0);
      assert.equal(await evaluate('document.querySelectorAll(".background-fog,.background-neon,.background-hologram").length'),0);
      assert(disabled.sameImage,'Disabling effects must preserve the original image');
      await evaluate(`document.querySelector('#${id}').click()`);
      await waitReady('document.querySelector(".background-effects")?.dataset.state==="running" && !!document.querySelector(".hologram-panel")');
    }
    await evaluate("document.querySelector('#toggle-image').click()");
    await waitReady('!!document.querySelector(".background-notice") && !document.querySelector(".background-image")');
    assert.equal(await evaluate('document.querySelectorAll(".background-neon,.background-hologram").length'),0);
    await evaluate("document.querySelector('#toggle-image').click()");
    await waitReady('!!document.querySelector(".hologram-panel") && !document.querySelector(".background-notice")');
    assert(await evaluate('document.querySelector(".background-image").naturalWidth>0'));
    profiles={baseline,monitor,transitions,reduced,unmounted,remounted,fallbackChecks,disabledChecks,imageSourceRecovery:true};
  }
  let settings = null;
  if (process.env.BACKGROUND_TEST_URL) {
    const navigate = async url => {
      const previous=await evaluate('performance.timeOrigin');await call('Page.navigate',{url});
      await waitReady(`performance.timeOrigin!==${previous} && document.readyState==='complete'`);
      await waitReady('document.querySelectorAll(".device-button").length===2');
    };
    await navigate(`${baseUrl}/?backgroundDebug=1`);
    assert.equal(await evaluate('document.querySelectorAll("[data-background-tools]").length'),0,'Production must ignore debug query');
    const devUrl=new URL(process.env.BACKGROUND_TEST_URL);
    devUrl.search='';await navigate(devUrl.href);
    assert.equal(await evaluate('document.querySelectorAll("[data-background-tools]").length'),0,'Development requires opt-in');
    devUrl.search='?backgroundDebug=1';await navigate(devUrl.href);
    await waitReady('!!document.querySelector(".background-tools-toggle")');
    assert.equal(await evaluate('document.querySelectorAll(".background-settings").length'),0,'Panel starts closed');
    await evaluate('document.querySelector(".background-tools-toggle").focus()');await key('Enter');
    await waitReady('document.activeElement?.id==="background-profile"');
    await evaluate('document.querySelector(".background-image").decode()');
    await evaluate('window.__settingsImage=document.querySelector(".background-image");window.__settingsCard=document.querySelector("[data-tv-zone=rail]");void 0');
    const setRange = async (id,value) => {
      await evaluate(`(() => {const el=document.querySelector('#background-${id}');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,${value});el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
      await waitReady(`Number(document.querySelector('#background-${id}').value)===${value}`);
    };
    const setProfile = async profile => {
      await evaluate(`(() => {const el=document.querySelector('#background-profile');el.value='${profile}';el.dispatchEvent(new Event('change',{bubbles:true}));})()`);
      await waitReady(`document.querySelector('.cyberpunk-background').dataset.profile==='${profile}'`);
    };
    await setRange('rainIntensity',0);await setRange('particleCount',100);
    await waitReady('document.querySelector(".background-effects").dataset.rainCount==="0" && document.querySelector(".background-effects").dataset.particleCount==="80"');
    await setRange('fogDensity',0);await waitReady('!document.querySelector(".background-fog")');
    await setRange('fogDensity',80);await waitReady('!!document.querySelector(".background-fog")');
    await setRange('neonIntensity',40);await setRange('rainSpeed',2);
    await evaluate('document.querySelector("#background-rainIntensity").focus()');await key('ArrowRight');
    assert.equal(await evaluate('document.activeElement.id'),'background-rainIntensity');
    assert.equal(await evaluate('document.querySelector("#background-rainIntensity").value'),'1');
    await setRange('rainIntensity',50);
    await evaluate('document.querySelector("#background-hologramGlitch").click()');
    await waitReady('!document.querySelector(".hologram-red")');
    await setProfile('cinematic');
    await waitReady('document.querySelector(".background-effects").dataset.rainCount==="224" && document.querySelector(".background-effects").dataset.particleCount==="200"');
    await setRange('rainSpeed',0);await waitReady('document.querySelector(".background-effects").dataset.rainCount==="0"');
    await setRange('rainSpeed',2);
    await setProfile('eco');await waitReady('!document.querySelector(".background-effects")');
    assert.equal(await evaluate('document.querySelector("#background-rainIntensity").value'),'50');
    await setProfile('balanced');
    await waitReady('document.querySelector(".background-effects").dataset.rainCount==="160"');
    const shot=await call('Page.captureScreenshot',{format:'png'});
    await writeFile(`${outputDir}/background-settings-1920x1080.png`,Buffer.from(shot.data,'base64'));
    await evaluate('document.querySelector(".background-settings-reset").click()');
    await waitReady('document.querySelector(".background-effects").dataset.rainCount==="208" && document.querySelector(".background-effects").dataset.particleCount==="40"');
    const reset=await evaluate(`Object.fromEntries(['rainIntensity','rainSpeed','fogDensity','neonIntensity','particleCount'].map(id=>[id,Number(document.querySelector('#background-'+id).value)]))`);
    assert.deepEqual(reset,{rainIntensity:65,rainSpeed:1,fogDensity:65,neonIntensity:100,particleCount:40});
    assert(await evaluate('document.querySelector("#background-hologramGlitch").checked'));
    assert(await evaluate('window.__settingsImage===document.querySelector(".background-image") && window.__settingsCard===document.querySelector("[data-tv-zone=rail]")'));
    await evaluate('document.querySelector("#background-profile").focus()');await key('Escape');
    await waitReady('!document.querySelector(".background-settings")');
    assert.equal(await activeId(),'app-demo-cinema');await key('ArrowRight');assert.equal(await activeId(),'app-demo-music');
    await evaluate('document.querySelector(".background-tools-toggle").click()');await waitReady('!!document.querySelector(".background-settings")');
    await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await waitReady('document.querySelector(".background-effects").dataset.state==="static"');
    await setRange('particleCount',70);assert.equal(await evaluate('document.querySelector(".background-effects").dataset.state'),'static');
    await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
    await waitReady('document.querySelector(".background-effects").dataset.state==="running"');
    await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
    const mobileShot=await call('Page.captureScreenshot',{format:'png'});await writeFile(`${outputDir}/background-settings-mobile.png`,Buffer.from(mobileShot.data,'base64'));
    assert(await evaluate('document.querySelector(".background-settings").getBoundingClientRect().width<=innerWidth'));
    await reloadPage();await waitReady('!!document.querySelector(".background-tools-toggle")');
    assert.equal(await evaluate('document.querySelectorAll(".background-settings").length'),0);
    await waitReady('document.querySelector(".background-effects").dataset.particleCount==="40"');
    settings={productionExcluded:true,developmentOptIn:true,startsClosed:true,liveControls:true,canonicalProfiles:true,reset,keyboard:true,escapeReturnsHome:true,reducedMotion:true,reloadResets:true,mobile:true};
  }
  if (process.env.ALLOCATION_MS) {
    const duration=Number(process.env.ALLOCATION_MS);
    assert(Number.isFinite(duration) && duration>=10000,'ALLOCATION_MS must be at least 10000');
    await call('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
    await call('Page.navigate',{url:baseUrl});
    await waitReady('document.querySelector(".background-effects")?.dataset.state==="running"');
    await new Promise(resolve=>setTimeout(resolve,3000));
    await call('HeapProfiler.collectGarbage');
    await call('HeapProfiler.startSampling',{samplingInterval:4096,includeObjectsCollectedByMajorGC:true,includeObjectsCollectedByMinorGC:true});
    const started=Date.now();await new Promise(resolve=>setTimeout(resolve,duration));
    const {profile:allocation}=await call('HeapProfiler.stopSampling');
    const nodes=[];
    const visit=node=>{
      if(node.selfSize) nodes.push({bytes:node.selfSize,function:node.callFrame.functionName,url:node.callFrame.url,line:node.callFrame.lineNumber});
      node.children.forEach(visit);
    };
    visit(allocation.head);nodes.sort((a,b)=>b.bytes-a.bytes);
    await writeFile(`${outputDir}/allocations.json`,JSON.stringify({environment:await call('Browser.getVersion'),durationMs:Date.now()-started,
      intervalBytes:4096,totalSampledBytes:nodes.reduce((sum,node)=>sum+node.bytes,0),nodes,profile:allocation,
      limitations:'Statistical JS allocation samples including collected objects; not all allocations, native Canvas buffers or GPU memory. Production Home, headless --disable-gpu, 1080p DPR1 Balanced.'},null,2));
  }
  if (process.env.STABILITY_MS) {
    const duration = Number(process.env.STABILITY_MS);
    assert(Number.isFinite(duration) && duration >= 60000, 'STABILITY_MS must be at least 60000');
    assert(process.env.PROFILE_TEST_URL, 'Stability check requires PROFILE_TEST_URL');
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const census = () => evaluate(`(() => {
      const r=window.__backgroundResources;
      // The test probe must not itself retain disposed Canvas buffers during heap sampling.
      for(const s of r.sprites) if(s.width===0) r.sprites.delete(s);
      const c=document.querySelector('.background-effects');
      return {raf:r.frames.size,resize:r.resize.size,observers:r.observers.size,sprites:r.sprites.size,
        canvases:document.querySelectorAll('.background-effects').length,width:c?.width,height:c?.height,
        fps:Number(c?.dataset.fps||0),averageDrawMs:Number(c?.dataset.averageDrawMs||0),maxDrawMs:Number(c?.dataset.maxDrawMs||0)};
    })()`);
    const metrics = async () => {
      await call('HeapProfiler.collectGarbage');
      return Object.fromEntries((await call('Performance.getMetrics')).metrics.map(({name,value})=>[name,value]));
    };
    await call('Performance.enable');
    await call('Page.navigate',{url:process.env.PROFILE_TEST_URL});
    await waitReady('window.__backgroundResources && document.querySelector(".background-effects")?.dataset.state==="running"');
    const transitions=[];
    for(let i=0;i<30;i++) {
      const profile=['cinematic','eco','balanced'][i%3];
      await evaluate(`document.querySelector('#profile-${profile}').click()`);
      await waitReady(`document.querySelector('.cyberpunk-background')?.dataset.profile==='${profile}'`);
      const width=i%2?1920:3840,height=width*9/16;
      await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:i%2?1:2,mobile:false});
      await sleep(100);
      const r=await census();transitions.push({profile,...r});
      assert.equal(r.raf,profile==='eco'?0:1);assert.equal(r.canvases,profile==='eco'?0:1);
      assert.equal(r.sprites,profile==='eco'?0:5);assert.equal(r.resize,profile==='eco'?0:3);assert.equal(r.observers,profile==='eco'?0:3);
      if(profile!=='eco') assert(r.width<=1920 && r.height<=1080);
    }
    await evaluate('document.querySelector("#toggle-engine").click()');
    await waitReady('!document.querySelector(".cyberpunk-background")');
    const unmounted=await census();
    assert.equal(unmounted.raf,0);assert.equal(unmounted.resize,0);assert.equal(unmounted.observers,0);assert.equal(unmounted.sprites,0);

    // Reuse the pre-React test census on the production Home, never in shipped code.
    const fixture=await readFile(new URL('./fixtures/background-profiles.html',import.meta.url),'utf8');
    const probe=fixture.match(/<script>([\s\S]*?)<\/script>/)[1];
    const {identifier}=await call('Page.addScriptToEvaluateOnNewDocument',{source:probe});
    await call('Page.navigate',{url:`${process.env.BACKGROUND_TEST_URL ?? 'http://127.0.0.1:5188/'}?backgroundDebug=1`});
    await waitReady('!!document.querySelector(".background-tools-toggle")');
    await evaluate('document.querySelector(".background-tools-toggle").click()');
    await waitReady('!!document.querySelector("#background-fogDensity")');
    const dragInitial=await metrics();
    const dragStarted=Date.now();
    // Distinct browser tasks ensure React commits each change, rather than batching the whole drag.
    for(let i=0;i<120;i++) {
      const id=['fogDensity','neonIntensity','rainIntensity','particleCount'][i%4];
      const value=20+i%60;
      await evaluate(`(() => {const el=document.querySelector('#background-${id}');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,${value});el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
      await sleep(25);
      const r=await census();assert.equal(r.raf,1);assert.equal(r.sprites,5);assert.equal(r.canvases,1);
    }
    const drag={changes:120,elapsedMs:Date.now()-dragStarted,initial:dragInitial,final:await metrics(),resources:await census()};
    await call('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
    await call('Page.navigate',{url:baseUrl});
    await waitReady('document.querySelector(".background-effects")?.dataset.state==="running" && !!document.querySelector(".hologram-panel")');
    await sleep(3000);
    await call('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight'});
    await call('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight'});
    const initialFocus=await evaluate('document.activeElement.dataset.tvId');
    const initial=await metrics(),samples=[];
    const started=Date.now();
    while(Date.now()-started<duration) {
      await sleep(Math.min(10000,duration-(Date.now()-started)));
      const r=await census();samples.push({elapsedMs:Date.now()-started,...r,metrics:await metrics()});
      assert.equal(r.raf,1);assert.equal(r.canvases,1);assert.equal(r.sprites,5);assert.equal(r.resize,3);assert.equal(r.observers,3);
      assert.equal(await evaluate('document.activeElement.dataset.tvId'),initialFocus,'Animation must preserve focus');
      console.log(`Stability ${Math.round((Date.now()-started)/1000)}s: ${r.fps} draw/s, ${r.averageDrawMs}ms CPU/draw`);
    }
    const actualDurationMs=Date.now()-started, final=await metrics();
    // CDP main-thread counters compare full scene with CSS layers hidden. They do not measure GPU compositing.
    const cpuWindows=[];
    for(const css of [true,false]) {
      await evaluate(`document.querySelectorAll('.background-neon,.background-hologram,.background-fog').forEach(el=>el.style.display=${css?"''":"'none'"})`);
      await sleep(1000);const before=await metrics();await sleep(10000);const after=await metrics();
      cpuWindows.push({css,seconds:after.Timestamp-before.Timestamp,taskSeconds:after.TaskDuration-before.TaskDuration,
        scriptSeconds:after.ScriptDuration-before.ScriptDuration,layoutSeconds:after.LayoutDuration-before.LayoutDuration,
        styleSeconds:after.RecalcStyleDuration-before.RecalcStyleDuration,canvas:await census()});
    }
    await evaluate("document.querySelectorAll('.background-neon,.background-hologram,.background-fog').forEach(el=>el.style.display='')");
    await call('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowDown',code:'ArrowDown'});
    await call('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowDown',code:'ArrowDown'});
    assert.equal(await evaluate('document.activeElement.dataset.tvZone'),'widgets');
    await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
    await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape'});
    assert.equal(await evaluate('document.activeElement.dataset.tvZone'),'rail');
    await call('Page.removeScriptToEvaluateOnNewDocument',{identifier});
    await writeFile(`${outputDir}/stability.json`,JSON.stringify({environment:await call('Browser.getVersion'),node:process.version,
      platform:process.platform,mode:'production, headless --disable-gpu',viewport:{width:1920,height:1080,dpr:1},profile:'balanced',
      requestedDurationMs:duration,actualDurationMs,transitions,unmounted,drag,initial,final,samples,cpuWindows,runtimeErrors,
      limitations:'Forced-GC JS heap and resource counts, not total process/GPU memory or proof of no leaks. CSS windows are main-thread counters only. No TV test.'},null,2));
  }
  assert.deepEqual(runtimeErrors,[]);
  await writeFile(`${outputDir}/shell-metrics.json`,JSON.stringify({settings,profiles,particlePool,particleCoverage,particleMotion:true,particleReducedMotion:true,results,onePage:true,keyboardWidgets:true,fixedMotionIgnoresStorage:true,systemReducedMotion:true,neonPulseRange,hologramMapping:true,hologramScan:true,holoSample,hologramPause:true,neonMapping:true,neonPulse:true,neonSample,neonVisibilityPause:true,runtimeErrors,rainCoverage,fogTimelineAndContinuity:true,fogVisibilityPause:true,fogNoFilters:true,imageFailureFallback:true,rainAnimation:true,rainResizeBudget:true,visibilityStopResume:true,canvasUnavailableFallback:true,originalObjectFit:"cover"},null,2));
  console.log('One-page Home acceptance passed: layout, widgets, particles, hologram, neon, fog and rain, resize, visibility, fallback and Back.');
} finally {
  socket?.close();
  await new Promise(resolve => {
    if (chrome.exitCode !== null || chrome.signalCode !== null) { resolve(); return; }
    const timer = setTimeout(() => { chrome.kill('SIGKILL'); resolve(); }, 5000);
    chrome.once('exit', () => { clearTimeout(timer); resolve(); });
    chrome.kill();
  });
  await rm(profile, { recursive: true, force: true });
}
