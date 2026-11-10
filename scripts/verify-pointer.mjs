import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

/** CDP mouse/touch, synthetic stationary moves, and the development remote all exercise the actual Home. */
export async function verifyPointerAndRemote({call,evaluate,key,activeId,waitReady,outputDir,baseUrl,developmentUrl}) {
  const ready = () => waitReady('document.querySelectorAll(".app-card").length===7');
  const navigate = async url => { await call('Page.navigate',{url});await ready(); };
  const point = selector => evaluate(`(() => {const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
  const move = async selector => { const p=await point(selector);await call('Input.dispatchMouseEvent',{type:'mouseMoved',...p});return p; };
  const click = async selector => {
    const p=await move(selector);
    await call('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',clickCount:1});
    await call('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button:'left',clickCount:1});
  };
  const card = id => `[data-tv-id="app-demo-${id}"]`;
  const remote = key => `[data-remote-key="${key}"]`;
  const shot = async name => { const capture=await call('Page.captureScreenshot',{format:'png'});await writeFile(`${outputDir}/${name}.png`,Buffer.from(capture.data,'base64')); };
  await call('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
  await navigate(baseUrl);
  await evaluate('window.__pointerClicks=0;document.addEventListener("click",e=>{if(e.target.closest?.("[data-tv-id]"))window.__pointerClicks++;},true)');
  const hovered=await move(card('music'));
  await waitReady('document.activeElement?.dataset.tvId==="app-demo-music"');
  assert.equal(await evaluate('window.__pointerClicks'),0,'Hover must not activate');
  assert.equal(await evaluate('document.querySelector(".tv-shell").dataset.inputMode'),'pointer');
  await key('ArrowRight');assert.equal(await activeId(),'app-demo-video');
  await evaluate(`document.querySelector('${card('music')}').dispatchEvent(new PointerEvent('pointermove',{pointerType:'mouse',clientX:${hovered.x},clientY:${hovered.y},bubbles:true}))`);
  assert.equal(await activeId(),'app-demo-video','Stationary pointer cannot steal D-pad focus');
  assert.equal(await evaluate('document.querySelector(".tv-shell").dataset.inputMode'),'keyboard');
  await evaluate(`document.querySelector('${card('music')}').dispatchEvent(new PointerEvent('pointermove',{pointerType:'touch',clientX:100,clientY:200,bubbles:true}))`);
  assert.equal(await activeId(),'app-demo-video','Touch movement is not hover');
  await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:hovered.x+2,y:hovered.y+2});
  await waitReady('document.activeElement?.dataset.tvId==="app-demo-music"');
  await click(card('music'));await waitReady('!!document.querySelector(".action-dialog[open]")');
  assert.equal(await evaluate('window.__pointerClicks'),1,'Pointer click must activate once');
  await move(card('cinema'));assert(await evaluate('document.querySelector(".action-dialog").contains(document.activeElement)'),'Modal preserves inert Home');
  await key('Escape');await waitReady('!document.querySelector(".action-dialog")');assert.equal(await activeId(),'app-demo-music');
  await move('[data-tv-id="watch-neon-district"]');await waitReady('document.activeElement?.dataset.tvId==="watch-neon-district"');
  await key('ArrowUp');assert.equal(await activeId(),'app-demo-music','Pointer-selected rail memory is retained');
  await evaluate('window.__pointerClicks=0');
  await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  const touch=await point(card('video'));
  await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touch]});
  await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await waitReady('!!document.querySelector(".action-dialog[open]")');
  assert.equal(await evaluate('window.__pointerClicks'),1,'Tap must activate once');
  await key('Escape');await waitReady('!document.querySelector(".action-dialog")');assert.equal(await activeId(),'app-demo-video');
  await call('Emulation.setTouchEmulationEnabled',{enabled:false});
  await shot('pointer-home-1920x1080');
  const production=new URL(baseUrl);production.searchParams.set('remoteDebug','1');
  await navigate(production.href);assert.equal(await evaluate('document.querySelectorAll("[data-remote-tools]").length'),0);
  let simulator=null;
  if(developmentUrl) {
    await navigate(developmentUrl);assert.equal(await evaluate('document.querySelectorAll("[data-remote-tools]").length'),0);
    const url=new URL(developmentUrl);url.searchParams.set('remoteDebug','1');
    await navigate(url.href);await waitReady('!!document.querySelector(".remote-toggle")');
    assert.equal(await evaluate('document.querySelector(".remote-toggle").getAttribute("aria-expanded")'),'false');
    await key('ArrowRight');assert.equal(await activeId(),'app-demo-cinema');
    await click('.remote-toggle');await waitReady('!!document.querySelector(".remote-panel")');
    assert.equal(await activeId(),'app-demo-cinema','Opening remote must preserve Home focus');
    await click(remote('ArrowRight'));assert.equal(await activeId(),'app-demo-music');
    await click(remote('ArrowLeft'));assert.equal(await activeId(),'app-demo-cinema');
    await click(remote('ArrowDown'));assert.equal(await activeId(),'watch-neon-district');
    assert(await evaluate('getComputedStyle(document.activeElement).outlineStyle==="solid" && parseFloat(getComputedStyle(document.activeElement).outlineWidth)>0'),'Synthetic remote keeps a visible widget focus');
    await click(remote('OK'));await waitReady('!!document.querySelector(".action-dialog[open]") && !!document.querySelector(".remote-panel")');
    assert(await evaluate('!!document.querySelector(".action-dialog [data-remote-tools]")'),'Remote must remain usable inside native modal');
    await key('Tab');assert(await evaluate('document.activeElement.classList.contains("remote-toggle")'));
    await key('Tab');assert.equal(await evaluate('document.activeElement.dataset.remoteKey'),'ArrowUp');
    await key('Enter');assert(await evaluate('document.activeElement.classList.contains("action-dialog-close")'),'Simulator command works without a mouse');
    await shot('remote-modal-1920x1080');
    await click(remote('Escape'));await waitReady('!document.querySelector(".action-dialog")');assert.equal(await activeId(),'watch-neon-district');
    await click(remote('Escape'));assert.equal(await activeId(),'app-demo-cinema');
    await evaluate('window.__remoteClicks=0;document.addEventListener("click",e=>{if(e.target.closest?.("[data-tv-id]"))window.__remoteClicks++;},true)');
    await click(remote('OK'));await waitReady('!!document.querySelector(".action-dialog[open]")');
    await click(remote('OK'));await waitReady('!document.querySelector(".action-dialog")');
    assert.equal(await evaluate('window.__remoteClicks'),1,'Simulated OK must not duplicate native activation');
    assert.equal(await activeId(),'app-demo-cinema');
    for(const [width,height] of [[1920,1080],[3840,2160],[390,844]]) {
      await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
      assert(await evaluate('(() => {const r=document.querySelector(".remote-tools").getBoundingClientRect();return r.left>=0 && r.top>=0 && r.right<=innerWidth && r.bottom<=innerHeight;})()'),'Simulator fits viewport');
      await shot(`remote-simulator-${width}x${height}`);
    }
    await call('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
    url.searchParams.set('backgroundDebug','1');await navigate(url.href);await waitReady('!!document.querySelector(".background-tools-toggle") && !!document.querySelector(".remote-toggle")');
    await click('.background-tools-toggle');await waitReady('!!document.querySelector("#background-rainIntensity")');
    await evaluate('document.querySelector("#background-rainIntensity").focus()');await key('ArrowRight');
    assert.equal(await evaluate('document.querySelector("#background-rainIntensity").value'),'66','Native range input remains isolated');
    simulator={developmentOptIn:true,startsClosed:true,focusPreserved:true,homeCommands:true,modalCommands:true,keyboardControls:true,
      singleActivation:true,productionExcluded:true,backgroundPanelNativeInput:true,viewportChecks:[1920,3840,390]};
  }
  await call('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
  await navigate(baseUrl);
  const result={mouseHover:true,noHoverActivation:true,singleClick:true,stationaryPointerIgnored:true,touchMoveIgnored:true,singleTouchTap:true,
    pointerKeyboardContinuity:true,modalIsolation:true,railMemory:true,simulator,limitations:'Mouse/touch via CDP, stationary/touch-move probes via synthetic PointerEvent; simulator sends DOM KeyboardEvent. No real Magic Remote or TV verified.'};
  await writeFile(`${outputDir}/pointer-metrics.json`,JSON.stringify(result,null,2));
  return result;
}
