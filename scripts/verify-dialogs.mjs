import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

/** Browser acceptance for modal ownership, keyboard isolation and actual return targets. */
export async function verifyActionDialogs({ call, evaluate, key, activeId, waitReady, reloadPage, outputDir, baseUrl, developmentUrl }) {
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await waitReady('document.querySelector(".background-effects")?.dataset.state==="running"');
  await evaluate('window.__dialogImage=document.querySelector(".background-image");window.__dialogCanvas=document.querySelector(".background-effects");void 0');
  const openAction = async id => {
    await evaluate(`document.querySelector('[data-tv-id="${id}"]').focus()`);
    await key('Enter');
    await waitReady('!!document.querySelector(".action-dialog[open]")');
    assert(await evaluate('document.querySelector(".action-dialog").matches(":modal")'));
    assert(await evaluate('document.activeElement.classList.contains("action-dialog-close")'));
  };
  await openAction('app-demo-music');
  assert(await evaluate('document.querySelector(".action-dialog").textContent.includes("Avvio simulato: Musica demo")'));
  assert(await evaluate('!!document.querySelector(".action-dialog[aria-labelledby][aria-describedby][aria-modal=true]")'));
  const accessibility=await call('Accessibility.getFullAXTree');
  assert(accessibility.nodes.some(node=>node.role?.value==='dialog' && node.name?.value==='Musica demo' && node.description?.value?.includes('Avvio simulato')),'Accessible dialog name and description');
  // A programmatic second request stands in for a late async result, not a user click through inert Home.
  await evaluate('document.querySelector("[data-tv-id=app-demo-cinema]").click()');
  await waitReady('document.querySelector(".rail-feedback").textContent.includes("Avvio simulato: Cinema demo")');
  assert(await evaluate('document.querySelector(".action-dialog h2").textContent==="Musica demo"'),'Do not replace an open dialog');
  const point=await evaluate('(() => {const r=document.querySelector("[data-tv-id=app-demo-cinema]").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()');
  await call('Input.dispatchMouseEvent',{type:'mousePressed',...point,button:'left',clickCount:1});
  await call('Input.dispatchMouseEvent',{type:'mouseReleased',...point,button:'left',clickCount:1});
  assert(await evaluate('!!document.querySelector(".action-dialog[open]")'),'Backdrop click must not dismiss');
  for(const name of ['Tab','ArrowDown','ArrowUp','ArrowLeft','ArrowRight']) {
    await key(name);assert(await evaluate('document.activeElement.classList.contains("action-dialog-close")'));
  }
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',modifiers:1,windowsVirtualKeyCode:9});
  await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',modifiers:1,windowsVirtualKeyCode:9});
  assert(await evaluate('document.activeElement.classList.contains("action-dialog-close")'));
  await evaluate('document.querySelector("[data-tv-id=app-demo-cinema]").focus()');
  assert(await evaluate('document.querySelector(".action-dialog").contains(document.activeElement)'),'Underlying Home must not accept focus');
  for(const name of ['Escape','Enter']) {
    await call('Input.dispatchKeyEvent',{type:'keyDown',key:name,code:name,autoRepeat:true});
    assert(await evaluate('!!document.querySelector(".action-dialog[open]")'),'Auto-repeat must not dismiss a modal');
    await call('Input.dispatchKeyEvent',{type:'keyUp',key:name,code:name});
  }
  await waitReady('Number(document.querySelector(".background-effects").dataset.fps)>0');
  assert(await evaluate('document.querySelector(".background-image")===window.__dialogImage && document.querySelector(".background-effects")===window.__dialogCanvas'));
  for(const [width,height] of [[1920,1080],[3840,2160],[390,844]]) {
    await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
    assert(await evaluate('(() => {const r=document.querySelector(".action-dialog").getBoundingClientRect();return r.left>=0 && r.top>=0 && r.right<=innerWidth && r.bottom<=innerHeight;})()'),'Dialog must fit viewport');
    const shot=await call('Page.captureScreenshot',{format:'png'});
    await writeFile(`${outputDir}/action-dialog-${width}x${height}.png`,Buffer.from(shot.data,'base64'));
  }
  await call('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
  await key('Escape');await waitReady('!document.querySelector(".action-dialog")');
  assert.equal(await activeId(),'app-demo-music');
  await key('ArrowRight');assert.equal(await activeId(),'app-demo-video');
  const backKeys=['Back','BrowserBack','Backspace','OK','Accept','Select','Enter'];
  for(const name of backKeys) {
    console.log(`Verifica chiusura dialogo: ${name}`);
    await openAction('watch-neon-district');
    assert(await evaluate('document.querySelector(".action-dialog").textContent.includes("Ripresa simulata")'));
    // CDP on Windows turns nonstandard remote names into an empty key. Test their DOM delivery explicitly.
    if(name==='Enter' || name==='Backspace') await key(name);
    else await evaluate(`document.activeElement.dispatchEvent(new KeyboardEvent('keydown',{key:'${name}',bubbles:true,cancelable:true}))`);
    await waitReady('!document.querySelector(".action-dialog")');
    assert.equal(await activeId(),'watch-neon-district');
  }
  await openAction('app-demo-music');
  await evaluate('document.querySelector(".action-dialog-close").click()');
  await waitReady('!document.querySelector(".action-dialog")');assert.equal(await activeId(),'app-demo-music');
  await openAction('app-demo-video');
  await evaluate('document.querySelector("[data-tv-id=app-demo-video]").disabled=true');
  await key('Escape');await waitReady('!document.querySelector(".action-dialog")');
  assert.equal(await activeId(),'app-demo-cinema','Disabled origin falls back to usable rail');
  await evaluate('document.querySelector("[data-tv-id=app-demo-video]").disabled=false');
  await openAction('app-demo-video');
  await evaluate('document.querySelector("[data-tv-id=app-demo-video]").style.visibility="hidden"');
  await key('Escape');await waitReady('!document.querySelector(".action-dialog")');
  assert.equal(await activeId(),'app-demo-cinema','Invisible origin falls back to usable rail');
  await evaluate('document.querySelector("[data-tv-id=app-demo-video]").style.visibility=""');
  await openAction('watch-neon-district');
  await key('Escape');await waitReady('!document.querySelector(".action-dialog")');assert.equal(await activeId(),'watch-neon-district');
  await key('Escape');assert.equal(await activeId(),'app-demo-cinema','Only the next Back acts on the Home');
  const noModal=await call('Page.addScriptToEvaluateOnNewDocument',{source:'HTMLDialogElement.prototype.showModal=undefined;'});
  await reloadPage();await waitReady('document.querySelectorAll(".app-card").length===7');
  await evaluate('document.querySelector("[data-tv-id=app-demo-music]").focus()');await key('Enter');
  await waitReady('document.querySelector(".rail-feedback").textContent.includes("Avvio simulato") && !document.querySelector(".action-dialog")');
  assert.equal(await activeId(),'app-demo-music','Unsupported dialog keeps Home and inline feedback usable');
  await call('Page.removeScriptToEvaluateOnNewDocument',{identifier:noModal.identifier});
  let developmentPanel = false;
  if(developmentUrl) {
    const url=new URL(developmentUrl);url.searchParams.set('backgroundDebug','1');
    await call('Page.navigate',{url:url.href});
    await waitReady('!!document.querySelector(".background-tools-toggle")');
    await evaluate('document.querySelector(".background-tools-toggle").click()');
    await waitReady('!!document.querySelector(".background-settings")');
    await openAction('app-demo-music');
    await key('Escape');await waitReady('!document.querySelector(".action-dialog")');
    assert.equal(await activeId(),'app-demo-music');
    assert(await evaluate('!!document.querySelector(".background-settings")'),'Dismiss only the front modal');
    await evaluate('document.querySelector("#background-profile").focus()');await key('Escape');
    await waitReady('!document.querySelector(".background-settings")');developmentPanel=true;
  }
  await call('Page.navigate',{url:baseUrl});await waitReady('document.querySelectorAll(".app-card").length===7');
  const result={nativeModal:true,labelled:true,focusContained:true,backgroundInert:true,focusRestored:true,
    repeatIgnored:true,backKeys:['Escape',...backKeys],disabledOriginFallback:true,hiddenOriginFallback:true,unsupportedNativeFallback:true,
    viewportChecks:[1920,3840,390],backgroundPreserved:true,developmentPanel,accessibleTree:true,overlappingRequestsIgnored:true,backdropDoesNotDismiss:true,
    aliasDelivery:'Back/BrowserBack/OK/Accept/Select: synthetic DOM KeyboardEvent; Escape/Enter/Backspace: native CDP. No real remote tested.'};
  await writeFile(`${outputDir}/dialog-metrics.json`,JSON.stringify(result,null,2));
  return result;
}
