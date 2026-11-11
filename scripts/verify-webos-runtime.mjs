import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

/** Controlled TV bridge beneath the unmodified LG SDK, never evidence from hardware. */
export async function verifyWebosRuntime(context, url) {
  const { call, evaluate, waitReady, key, outputDir } = context;
  const directory = `${outputDir}/webos-runtime`;
  await mkdir(directory, { recursive: true });
  const { identifier } = await call('Page.addScriptToEvaluateOnNewDocument', { source: `
    Object.defineProperty(navigator,'userAgent',{get:()=> 'Mozilla/5.0 (Web0S; Linux/SmartTV) Chrome/132.0.0.0 Large Screen'});
    window.__tvCalls=[]; window.__tvBack=0; window.__tvResponse='success'; window.__tvCancel=0;
    window.PalmSystem={platformBack(){window.__tvBack++}};
    window.PalmServiceBridge=class {
      call(uri,parameters){
        window.__tvCalls.push({uri,parameters:JSON.parse(parameters)});
        queueMicrotask(()=>{
          if(window.__tvResponse==='timeout') return;
          this.onservicecallback(JSON.stringify(window.__tvResponse==='deny'? {returnValue:false,errorCode:-1,errorText:'denied'}:
            {returnValue:true,modelName:'TEST TV',firmwareVersion:'test-firmware',sdkVersion:'test-sdk'}));
        });
      }
      cancel(){window.__tvCancel++}
    };
  ` });
  const results = [];
  try {
    await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
    for (const [width,height] of [[1920,1080],[3840,2160]]) {
      await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
      await call('Page.navigate',{url});
      await waitReady(`document.querySelector('[data-system-info]')?.textContent.includes('TEST TV') && document.querySelectorAll('.resource-retry').length>=4`);
      const initial = await evaluate(`({footer:document.querySelector('.shell-footer').textContent,calls:window.__tvCalls,
        appCards:document.querySelectorAll('.app-card').length,
        overflow:document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight})`);
      assert.equal(initial.appCards,0); assert.equal(initial.calls.length,1); assert.equal(initial.overflow,false);
      assert.deepEqual(initial.calls[0],{uri:'luna://com.webos.service.tv.systemproperty/getSystemInfo',parameters:{keys:['modelName','firmwareVersion','sdkVersion']}});
      assert(initial.footer.includes('TV · webOS') && initial.footer.includes('test-sdk'));
      await waitReady(`document.querySelector('canvas')?.dataset.state==='running' && document.querySelector('canvas').width===1600`);
      const budget = await evaluate(`({width:document.querySelector('canvas').width,height:document.querySelector('canvas').height,rain:document.querySelector('canvas').dataset.rainCount,particles:document.querySelector('canvas').dataset.particleCount})`);
      assert.deepEqual(budget,{width:1600,height:900,rain:'179',particles:'32'});
      assert.equal(await evaluate(`document.querySelector('.inputs-heading span').textContent`),'TV');
      assert.equal(await evaluate(`document.querySelector('.smart-heading span').textContent`),'TV');
      await key('ArrowRight'); await key('ArrowDown'); await key('ArrowDown');
      assert.equal(await evaluate('document.activeElement.dataset.tvId'),'platform-mode');
      await key('ArrowUp');
      const back = () => evaluate(`document.activeElement.dispatchEvent(new KeyboardEvent('keydown',{key:'Unidentified',keyCode:461,bubbles:true,cancelable:true}))`);
      await evaluate(`document.querySelector('[data-tv-id="watch-neon-district"]').focus()`);
      // Find by the shared widget zone instead of depending on its fictional title.
      await key('Enter');
      await waitReady(`!!document.querySelector('dialog[open]')`);
      await back(); await waitReady(`!document.querySelector('dialog[open]')`);
      assert.equal(await evaluate('window.__tvBack'),0);
      await back(); assert.equal(await evaluate('window.__tvBack'),1);
      await evaluate(`document.querySelector('[data-tv-id="platform-mode"]').focus()`); await key('Enter');
      await waitReady(`document.querySelectorAll('.app-card').length===7`);
      assert.equal(await evaluate('window.__tvCalls.length'),1);
      assert((await evaluate(`document.querySelector('.shell-footer').textContent`)).includes('Demo'));
      await evaluate(`window.__tvResponse='deny';document.querySelector('[data-tv-id="platform-mode"]').focus()`); await key('Enter');
      await waitReady(`!!document.querySelector('[data-tv-id="system-retry"]')`);
      assert((await evaluate(`document.querySelector('[data-system-info]').textContent`)).includes('permessi'));
      await evaluate(`window.__tvResponse='success';document.querySelector('[data-tv-id="system-retry"]').focus()`); await key('Enter');
      await waitReady(`document.querySelector('[data-system-info]')?.textContent.includes('TEST TV')`);
      await call('Page.captureScreenshot',{format:'png'}).then(async shot => writeFile(`${directory}/tv-${width}.png`,Buffer.from(shot.data,'base64')));
      results.push({width,height,initial,footerDpadReachable:true,tvProvenanceLabels:true,modalBack461:true,homePlatformBack:true,demoAndReturn:true,deniedAndRetry:true,bridge:'fake; official LG SDK unmodified'});
    }
    await writeFile(`${directory}/metrics.json`,JSON.stringify({results,limitations:'Synthetic Palm bridge in Edge, not TV permission, remote or lifecycle certification.'},null,2));
  } finally {
    await call('Page.removeScriptToEvaluateOnNewDocument',{identifier});
    await call('Page.navigate',{url:context.baseUrl});
    await waitReady(`document.querySelectorAll('.app-card').length===7`);
  }
}
