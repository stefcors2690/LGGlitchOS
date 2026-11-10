import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

/** Real two-minute deadlines, not shortened production settings or virtual time. Opt-in IDLE_TEST=1. */
export async function verifyIdleDimming({call,evaluate,key,activeId,waitReady,outputDir,baseUrl}) {
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const snapshot=()=>evaluate(`(() => {
    const root=document.querySelector('.tv-shell'),dialog=document.querySelector('.action-dialog');
    return {idle:root.dataset.idle,opacity:getComputedStyle(root).opacity,focus:document.activeElement.dataset.tvId??document.activeElement.className,
      canvas:document.querySelector('.background-effects')?.dataset.state,logo:document.querySelector('.brand-logo img').dataset.motion,
      dialogOpacity:dialog?getComputedStyle(dialog).opacity:null,transition:getComputedStyle(root).transitionDuration};
  })()`);
  const waitIdle=async label=>{
    const start=Date.now();let nextLog=20000;
    while(Date.now()-start<130000) {
      if(await evaluate('document.querySelector(".tv-shell")?.dataset.idle==="true"')) return Date.now()-start;
      await sleep(500);
      if(Date.now()-start>=nextLog){console.log(`Idle ${label}: attesa ${Math.round((Date.now()-start)/1000)}s`);nextLog+=20000;}
    }
    throw new Error(`Idle deadline not reached: ${label}`);
  };
  const capture=async name=>{const shot=await call('Page.captureScreenshot',{format:'png'});await writeFile(`${outputDir}/${name}.png`,Buffer.from(shot.data,'base64'));};
  await call('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await call('Page.navigate',{url:baseUrl});
  await waitReady('document.querySelectorAll(".app-card").length===7 && document.querySelector(".background-effects")?.dataset.state==="running"');
  assert.equal(await evaluate('document.hidden'),false);
  await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:1,y:1});
  await key('ArrowRight');assert.equal(await activeId(),'app-demo-cinema');
  const homeWaitMs=await waitIdle('Home');
  assert(homeWaitMs>=118000,'No early dimming before the default deadline');
  await waitReady('Math.abs(Number(getComputedStyle(document.querySelector(".tv-shell")).opacity)-.45)<.01 && document.querySelector(".background-effects")?.dataset.state==="static"');
  const home=await snapshot();assert.equal(home.logo,'still');assert.equal(await activeId(),'app-demo-cinema');
  await capture('idle-home-1920x1080');
  await call('Emulation.setDeviceMetricsOverride',{width:3840,height:2160,deviceScaleFactor:1,mobile:false});
  assert.equal(await evaluate('document.querySelector(".tv-shell").dataset.idle'),'true');
  await capture('idle-home-3840x2160');
  await call('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await key('ArrowRight');await waitReady('document.querySelector(".tv-shell").dataset.idle==="false"');
  assert.equal(await activeId(),'app-demo-music','Wake input still performs its normal navigation');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".tv-shell")).opacity'),'1');
  assert.equal(await evaluate('document.querySelector(".background-effects").dataset.state'),'static','System reduction still wins after wake');
  await key('Enter');await waitReady('!!document.querySelector(".action-dialog[open]")');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".action-dialog")).animationName'),'none');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".action-dialog")).transitionDuration'),'0s');
  await key('Escape');await waitReady('!document.querySelector(".action-dialog")');
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await waitReady('document.querySelector(".background-effects")?.dataset.state==="running"');
  await evaluate('document.querySelector("[data-tv-id=watch-neon-district]").focus()');await key('Enter');
  await waitReady('!!document.querySelector(".action-dialog[open]")');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".action-dialog")).animationName'),'action-dialog-enter');
  const dialogWaitMs=await waitIdle('dialogo');
  assert(dialogWaitMs>=118000);
  await waitReady('Math.abs(Number(getComputedStyle(document.querySelector(".action-dialog")).opacity)-.45)<.01');
  const dialog=await snapshot();assert.equal(dialog.canvas,'static');assert.equal(dialog.logo,'still');
  assert(await evaluate('document.activeElement.classList.contains("action-dialog-close")'),'Idle must not move modal focus');
  await capture('idle-dialog-1920x1080');
  const point=await evaluate('(() => {const r=document.querySelector(".action-dialog-close").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()');
  await call('Input.dispatchMouseEvent',{type:'mousePressed',...point,button:'left',clickCount:1});
  await call('Input.dispatchMouseEvent',{type:'mouseReleased',...point,button:'left',clickCount:1});
  await waitReady('!document.querySelector(".action-dialog") && document.querySelector(".tv-shell").dataset.idle==="false"');
  assert.equal(await activeId(),'watch-neon-district','Wake click closes once and restores the actual origin');
  await waitReady('Number(getComputedStyle(document.querySelector(".tv-shell")).opacity)>.99 && document.querySelector(".background-effects")?.dataset.state==="running"');
  await evaluate('Object.defineProperty(document,"hidden",{configurable:true,value:true});document.dispatchEvent(new Event("visibilitychange"))');
  await waitReady('document.querySelector(".background-effects")?.dataset.state==="static"');
  await sleep(250);
  await evaluate('delete document.hidden;document.dispatchEvent(new Event("visibilitychange"))');
  await waitReady('document.querySelector(".tv-shell").dataset.idle==="false" && document.querySelector(".background-effects")?.dataset.state==="running"');
  const result={homeWaitMs,dialogWaitMs,home,dialog,keyboardWakeKeepsAction:true,pointerWakeKeepsAction:true,focusPreserved:true,
    systemReducedMotionWins:true,reducedMotionDisablesTransitions:true,visibilityReset:true,realDeadline:true,
    limitations:'Headless Edge, real idle waits; input/hidden state injected via CDP/DOM, not TV/GPU measurements. Hidden duration/cancellation/cleanup verified by unit scheduler tests.'};
  await writeFile(`${outputDir}/idle-metrics.json`,JSON.stringify(result,null,2));
  await call('Page.navigate',{url:baseUrl});await waitReady('document.querySelectorAll(".app-card").length===7');
  return result;
}
