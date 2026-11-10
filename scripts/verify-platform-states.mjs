import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

/** Browser acceptance against the same Home components with test-only adapters. */
export async function verifyPlatformStates({ call, evaluate, key, activeId, waitReady, outputDir, baseUrl, fixtureUrl }) {
  const navigate = async url => {
    const previous = await evaluate('performance.timeOrigin');
    await call('Page.navigate', { url });
    await waitReady(`performance.timeOrigin !== ${previous} && !!document.querySelector('.tv-shell')`);
  };
  const ready = () => waitReady('document.querySelectorAll(".app-card").length===7 && document.querySelectorAll(".input-button").length===4 && document.querySelectorAll(".device-button").length===2 && [...document.querySelectorAll("[aria-busy]")].every(el=>el.getAttribute("aria-busy")==="false")');
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const scenario = async name => { await click(`#scenario-${name}`); };
  const shot = async name => {
    const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    await writeFile(`${outputDir}/${name}.png`, Buffer.from(screenshot.data, 'base64'));
  };
  const counts = async () => { await click('#read-counts'); return evaluate('JSON.parse(document.querySelector("#command-counts").textContent)'); };
  await call('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await navigate(fixtureUrl); await ready();

  // Valid empty data is distinct from an error, with usable recovery controls in both zones.
  await scenario('empty'); await waitReady('document.querySelectorAll(".resource-retry").length===3');
  assert.equal(await evaluate('document.querySelectorAll(".resource-notice [role=alert]").length'), 0);
  assert.equal(await evaluate('document.querySelectorAll(".app-card,.input-button,.device-button").length'), 0);
  await key('ArrowRight'); assert.equal(await activeId(), 'apps-retry');
  await key('ArrowDown'); assert.equal(await activeId(), 'watch-neon-district');
  await key('ArrowRight'); assert.equal(await activeId(), 'inputs-retry');
  await key('ArrowRight'); assert.equal(await activeId(), 'devices-retry');
  await shot('empty-1920x1080');

  await scenario('errors'); await waitReady('document.querySelectorAll(".resource-notice [role=alert]").length===3');
  await click('#recover-reads');
  await evaluate('document.querySelector("[data-tv-id=apps-retry]").focus()');
  await key('Enter'); await waitReady('document.querySelectorAll(".app-card").length===7');
  // Focus returns to a surviving control, never remains on the removed retry.
  assert(await evaluate('!!document.activeElement.dataset.tvId && document.activeElement.isConnected'));
  await click('[data-tv-id=inputs-retry]'); await click('[data-tv-id=devices-retry]'); await ready();
  await scenario('rejected'); await waitReady('document.querySelectorAll(".resource-notice [role=alert]").length===3');
  assert.equal(await evaluate('document.querySelectorAll(".app-card,.input-button,.device-button").length'), 0);

  await scenario('unsupported-list'); await waitReady('document.querySelectorAll(".resource-notice [role=alert]").length===3');
  assert(await evaluate('[...document.querySelectorAll(".resource-notice [role=alert]")].every(el=>el.textContent.includes("non supportato"))'));
  await scenario('unsupported-command'); await ready();
  assert(await evaluate('[...document.querySelectorAll(".app-card,.input-button,.device-button")].every(el=>el.getAttribute("aria-disabled")==="true" && !!document.getElementById(el.getAttribute("aria-describedby"))?.textContent)'));
  await evaluate('document.querySelector(".app-card").focus()'); await key('Enter');
  await click('.input-button'); await click('.device-button');
  assert.deepEqual(await counts(), { app: 0, input: 0, device: 0 });
  assert.equal(await evaluate('document.querySelectorAll("dialog[open]").length'), 0);
  await shot('unsupported-1920x1080');

  await scenario('command-errors'); await ready();
  await click('.app-card'); await waitReady('!!document.querySelector("dialog[open]")');
  assert(await evaluate('document.querySelector("dialog").textContent.includes("Avvio non riuscito")'));
  assert(!(await evaluate('document.querySelector("dialog").textContent.includes("Avvio simulato")')));
  await key('Escape');
  await click('[data-tv-id=input-demo-hdmi-2]'); await click('.device-button');
  await waitReady('document.querySelector(".input-feedback").textContent.includes("non riuscito") && document.querySelector(".device-feedback").textContent.includes("non riuscito")');
  assert.equal(await evaluate('document.querySelector("[data-tv-id=input-demo-hdmi-1]").getAttribute("aria-pressed")'), 'true');
  assert.equal(await evaluate('document.querySelector(".device-button").getAttribute("aria-checked")'), 'false');

  await scenario('slow-command'); await ready();
  assert.equal(await evaluate('document.querySelector(".input-feedback").textContent'), '');
  assert.equal(await evaluate('document.querySelector(".device-feedback").textContent'), '');
  assert(!(await evaluate('document.querySelector(".rail-feedback").textContent.includes("non riuscito")')));
  await evaluate('for(let i=0;i<2;i++){document.querySelector("[data-tv-id=input-demo-hdmi-2]").click();document.querySelector(".device-button").click();}');
  assert.deepEqual(await counts(), { app: 0, input: 1, device: 1 });
  assert.equal(await evaluate('document.querySelector("[data-tv-id=input-demo-hdmi-1]").getAttribute("aria-pressed")'), 'true');
  assert.equal(await evaluate('document.querySelector(".device-button").getAttribute("aria-checked")'), 'false');
  await click('#resolve-pending');
  await waitReady('document.querySelector("[data-tv-id=input-demo-hdmi-2]").getAttribute("aria-pressed")==="true" && document.querySelector(".device-button").getAttribute("aria-checked")==="true"');

  // Neither a stale read nor command may update a replacement adapter or open a dialog.
  await scenario('loading'); await waitReady('document.querySelectorAll(".resource-notice [role=status]").length===3');
  await shot('loading-1920x1080');
  await scenario('empty'); await waitReady('document.querySelectorAll(".resource-retry").length===3');
  await click('#resolve-pending');
  await evaluate('new Promise(resolve=>setTimeout(resolve,150))');
  assert.equal(await evaluate('document.querySelectorAll(".app-card,.input-button,.device-button").length'), 0);
  await scenario('slow-command'); await ready();
  await evaluate('for(let i=0;i<2;i++){document.querySelector(".app-card").click();document.querySelector("[data-tv-id=input-demo-hdmi-2]").click();document.querySelector(".device-button").click();}');
  assert.deepEqual(await counts(), { app: 1, input: 1, device: 1 });
  await scenario('ready'); await ready(); await click('#resolve-pending');
  await evaluate('new Promise(resolve=>setTimeout(resolve,150))');
  assert.equal(await evaluate('document.querySelectorAll("dialog[open]").length'), 0);
  assert.equal(await evaluate('document.querySelector("[data-tv-id=input-demo-hdmi-1]").getAttribute("aria-pressed")'), 'true');
  assert.equal(await evaluate('document.querySelector(".device-button").getAttribute("aria-checked")'), 'false');

  // Real 10s deadline, then release old promises: late success must stay discarded.
  await scenario('loading'); await waitReady('document.querySelectorAll("[aria-busy=true]").length===3');
  const started = Date.now();
  await new Promise(resolve => setTimeout(resolve, 10_200));
  await waitReady('document.querySelectorAll(".resource-retry").length===3');
  const deadlineWaitMs = Date.now() - started;
  assert(await evaluate('[...document.querySelectorAll(".resource-notice [role=alert]")].every(el=>el.textContent.includes("non risponde"))'));
  await click('#resolve-pending'); await evaluate('new Promise(resolve=>setTimeout(resolve,150))');
  assert.equal(await evaluate('document.querySelectorAll(".resource-retry").length'), 3);
  await click('[data-tv-id=apps-retry]'); await click('#resolve-pending');
  await waitReady('document.querySelectorAll(".app-card").length===7');

  await scenario('empty'); await waitReady('document.querySelectorAll(".resource-retry").length===3');
  await call('Emulation.setDeviceMetricsOverride', { width: 3840, height: 2160, deviceScaleFactor: 1, mobile: false });
  await shot('empty-3840x2160');
  assert(await evaluate('document.documentElement.scrollWidth===innerWidth && document.documentElement.scrollHeight===innerHeight'));

  // Browser connection hint never blocks the local simulation or claims a tested Internet route.
  await navigate(baseUrl); await ready();
  await call('Network.enable');
  try {
    await call('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    await waitReady('document.querySelector(".connection-notice").textContent.includes("Demo locale")');
    await evaluate('document.querySelector(".app-card").focus()'); await key('Enter');
    await waitReady('!!document.querySelector("dialog[open]")');
    assert(await evaluate('document.querySelector("dialog").textContent.includes("Avvio simulato")'));
    await key('Escape'); await shot('offline-3840x2160');
    await call('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
    await shot('offline-1920x1080');
    assert(await evaluate('document.documentElement.scrollWidth===innerWidth && document.documentElement.scrollHeight===innerHeight'));
  } finally {
    await call('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    await call('Network.disable');
  }
  await waitReady('document.querySelector(".connection-notice").textContent===""');
  await writeFile(`${outputDir}/platform-metrics.json`, JSON.stringify({ empty: true, retryWithDpad: true, rejectedReads: true, unsupportedLists: true, unsupportedCommandsBlocked: true, noFalseSuccess: true, commandsNotOptimistic: true, duplicateCommandsBlocked: true, staleReadsIgnored: true, staleCommandsIgnored: true, realDeadlineWaitMs: deadlineWaitMs, timeoutLateSuccessIgnored: true, timeoutRetryRecovers: true, offlineLocalDemoWorks: true, offlineIsBrowserHint: true }, null, 2));
}
