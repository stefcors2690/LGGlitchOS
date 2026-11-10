import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

/** Final browser MVP matrix. AX is inspected through Chromium, not a screen reader certification. */
export async function verifyMvp({ call, evaluate, key, activeId, waitReady, outputDir, baseUrl }) {
  const results = [];
  const visibleFocus = async () => {
    const sample = await evaluate(`(() => {
      const el=document.activeElement,style=getComputedStyle(el),rect=el.getBoundingClientRect();
      const frame=el.querySelector('.app-frame-inner'),frameStyle=frame?getComputedStyle(frame):null;
      const outlined=style.outlineStyle!=='none' && parseFloat(style.outlineWidth)>0;
      const framed=frameStyle?.opacity==='1' && parseFloat(frameStyle.strokeWidth)>=1.5 && frameStyle.stroke==='rgb(0, 221, 245)';
      return {id:el.dataset.tvId,outlined,framed,inViewport:rect.width>0 && rect.height>0 && rect.left>=0 && rect.right<=innerWidth && rect.top>=0 && rect.bottom<=innerHeight};
    })()`);
    assert(sample.id && (sample.outlined || sample.framed) && sample.inViewport,
      `Every destination needs visible focus (native outline or approved inner SVG frame): ${JSON.stringify(sample)}`);
  };
  const axSummary = async () => {
    const { nodes } = await call('Accessibility.getFullAXTree');
    return nodes.filter(node => !node.ignored).map(node => ({ role: node.role?.value, name: node.name?.value,
      description: node.description?.value, properties: node.properties }));
  };
  for (const [width, height] of [[1920, 1080], [3840, 2160]]) {
    console.log(`MVP ${width}x${height}: AX, tastiera completa e latenza focus`);
    await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    const previous = await evaluate('performance.timeOrigin');
    await call('Page.navigate', { url: baseUrl });
    await waitReady(`performance.timeOrigin !== ${previous} && document.querySelectorAll('[data-tv-id]').length===14 && [...document.querySelectorAll('[aria-busy]')].every(el=>el.getAttribute('aria-busy')==='false')`);
    await evaluate('document.querySelector(".background-image").decode()');
    const ids = await evaluate('[...document.querySelectorAll("[data-tv-id]")].map(el=>el.dataset.tvId)');
    assert.equal(new Set(ids).size, 14);
    const semantics = await evaluate(String.raw`(() => {
      const ids=[...document.querySelectorAll('[id]')].map(el=>el.id);
      const missingReferences=[...document.querySelectorAll('[aria-labelledby],[aria-describedby]')].flatMap(el=>
        [el.getAttribute('aria-labelledby'),el.getAttribute('aria-describedby')].filter(Boolean).flatMap(value=>value.split(/\s+/)).filter(id=>!document.getElementById(id)));
      return {language:document.documentElement.lang,headings:document.querySelectorAll('h1').length,
        uniqueIds:new Set(ids).size===ids.length,missingReferences,
        unnamedImages:document.querySelectorAll('img:not([alt])').length,
        decorationHidden:[...document.querySelectorAll('.background-image,.app-symbol,.input-button svg,.device-button svg')].every(el=>el.closest('[aria-hidden=true]')||el.getAttribute('alt')==='')};
    })()`);
    assert.equal(semantics.language, 'it'); assert.equal(semantics.headings, 1);
    assert(semantics.uniqueIds); assert.deepEqual(semantics.missingReferences, []);
    assert.equal(semantics.unnamedImages, 0); assert(semantics.decorationHidden);
    const homeAx = await axSummary();
    assert.equal(homeAx.filter(node => node.role === 'main').length, 1);
    assert(homeAx.some(node => node.role === 'heading' && node.name === 'StefCors GL1tCh 0S'));
    const actions = homeAx.filter(node => node.role === 'button' || node.role === 'switch');
    assert.equal(actions.length, 14); assert(actions.every(node => typeof node.name === 'string' && node.name.trim().length > 0));
    assert(actions.every(node => /demo|simulat/i.test(node.name)), 'Every platform action must preserve Demo provenance');

    // Walk every control with D-pad, then activate every app and every widget exactly once.
    await key('ArrowRight'); assert.equal(await activeId(), ids[0]);
    const rail = ids.slice(0, 7), widgets = ids.slice(7), visited = [];
    for (let i = 0; i < rail.length; i++) {
      assert.equal(await activeId(), rail[i]); await visibleFocus(); visited.push(await activeId());
      await key('Enter'); await waitReady('!!document.querySelector("dialog[open]")');
      const modalAx = await axSummary();
      const dialog = modalAx.find(node => node.role === 'dialog');
      assert(dialog?.name?.trim()); assert(dialog.description?.includes('Avvio simulato'));
      assert.equal(modalAx.filter(node => node.role === 'button').length, 1, 'Inert Home must leave only modal Close exposed');
      await key('Escape'); await waitReady('!document.querySelector("dialog")');
      assert.equal(await activeId(), rail[i]);
      if (i < rail.length - 1) await key('ArrowRight');
    }
    // Row memory maps last rail index to the last lower control on first descent.
    await key('ArrowDown'); assert.equal(await activeId(), widgets.at(-1));
    for (let i = widgets.length - 1; i >= 0; i--) {
      assert.equal(await activeId(), widgets[i]); await visibleFocus(); visited.push(await activeId());
      const before = await evaluate('document.activeElement.getAttribute("aria-checked")');
      await key('Enter');
      if (i === 0) {
        await waitReady('!!document.querySelector("dialog[open]")');
        await key('Tab'); assert(await evaluate('document.activeElement.classList.contains("action-dialog-close")'));
        await key('Escape'); await waitReady('!document.querySelector("dialog")'); assert.equal(await activeId(), widgets[i]);
      } else if (before !== null) {
        await waitReady(`document.activeElement.getAttribute('aria-checked')!==${JSON.stringify(before)}`);
      } else await waitReady('document.activeElement.getAttribute("aria-pressed")==="true"');
      if (i > 0) await key('ArrowLeft');
    }
    assert.equal(new Set(visited).size, 14);
    await key('Escape'); assert.equal(await activeId(), rail[0]);
    // Native Tab and Shift+Tab order follows the DOM without traps outside a modal.
    const tabOrder = [await activeId()];
    for (let i = 1; i < ids.length; i++) { await key('Tab'); tabOrder.push(await activeId()); await visibleFocus(); }
    assert.deepEqual(tabOrder, ids);
    await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', modifiers: 8, windowsVirtualKeyCode: 9 });
    await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab' });
    assert.equal(await activeId(), ids.at(-2));
    await key('Escape');

    // Measure browser input-to-next-frame focus response with real CDP key events, scene awake.
    await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    await waitReady('document.querySelector(".background-effects")?.dataset.state==="running"');
    await evaluate(`window.__mvpLatency=[];window.__mvpCapture=event=>{
      if(!['ArrowRight','ArrowLeft'].includes(event.key))return;
      const start=performance.now();requestAnimationFrame(()=>window.__mvpLatency.push({ms:performance.now()-start,id:document.activeElement.dataset.tvId}));
    };document.addEventListener('keydown',window.__mvpCapture,true);`);
    for (let i = 0; i < 30; i++) {
      await key(i % 2 === 0 ? 'ArrowRight' : 'ArrowLeft');
      await waitReady(`window.__mvpLatency.length===${i + 1}`);
      assert.equal(await activeId(), rail[i % 2 === 0 ? 1 : 0]);
    }
    const latency = await evaluate('document.removeEventListener("keydown",window.__mvpCapture,true);window.__mvpLatency');
    const sorted = latency.map(sample => sample.ms).sort((a, b) => a - b);
    const geometry = await evaluate(`({horizontal:document.documentElement.scrollWidth>innerWidth,vertical:document.documentElement.scrollHeight>innerHeight,
      canvas:{width:document.querySelector('.background-effects').width,height:document.querySelector('.background-effects').height},
      navigation:performance.getEntriesByType('navigation').map(n=>({domContentLoadedMs:n.domContentLoadedEventEnd,loadMs:n.loadEventEnd})),
      resources:performance.getEntriesByType('resource').map(r=>({name:r.name,bytes:r.transferSize,durationMs:r.duration}))})`);
    assert(!geometry.horizontal && !geometry.vertical); assert(geometry.canvas.width <= 1920 && geometry.canvas.height <= 1080);
    assert(geometry.resources.every(resource => resource.name.startsWith('data:') || new URL(resource.name).origin === new URL(baseUrl).origin), 'No external startup resources');
    await key('ArrowDown');
    for (let i = 1; i < widgets.length; i++) await key('ArrowLeft');
    assert.equal(await activeId(), widgets[0]);
    await key('Enter'); await waitReady('!!document.querySelector("dialog[open]")');
    await key('Escape'); await key('Escape'); assert.equal(await activeId(), rail[0]);
    await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await waitReady('document.querySelector(".background-effects")?.dataset.state==="static"');
    const shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    await writeFile(`${outputDir}/mvp-home-${width}x${height}.png`, Buffer.from(shot.data, 'base64'));
    results.push({ width, height, semantics, homeAx, visited, tabOrder, geometry,
      focusLatency: { samples: latency, medianMs: sorted[Math.floor(sorted.length / 2)], p95Ms: sorted[Math.ceil(sorted.length * .95) - 1], maxMs: sorted.at(-1) } });
  }
  await writeFile(`${outputDir}/mvp-metrics.json`, JSON.stringify({ environment: await call('Browser.getVersion'), node: process.version,
    results, allActionsKeyboard: true, nativeTabAndReverse: true, modalAxIsolation: true, focusVisible: true,
    limitations: 'Chromium AX/DOM inspection and CDP keyboard, not screen reader/TV/WCAG certification. Input-to-next-RAF includes browser scheduling, excludes host dispatch/physical display latency; headless --disable-gpu, local cache and machine dependent. No GPU compositing benchmark.' }, null, 2));
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
}
