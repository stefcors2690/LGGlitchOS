import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { verifyMvp } from './verify-mvp.mjs';

/** File-scheme test with ordinary browser security, not --allow-file-access-from-files. */
export async function verifyPackagedFile(context, url) {
  assert.equal(new URL(url).protocol, 'file:');
  const outputDir = `${context.outputDir}/packaged-file`;
  await mkdir(outputDir, { recursive: true });
  await verifyMvp({ ...context, baseUrl: url, outputDir });
  const result = await context.evaluate(`({footer:document.querySelector('.shell-footer').textContent,
    classicEntry:[...document.scripts].some(script=>script.src.endsWith('.js')&&script.defer&&script.type!=='module'),
    imageLoaded:document.querySelector('.background-image').naturalWidth>0,
    localAssets:[...document.querySelectorAll('script[src],link[href]')].every(el=>(el.src||el.href).startsWith('file:')),
    noTools:document.querySelectorAll('[data-remote-tools],[data-background-tools]').length===0})`);
  assert(result.footer.includes('Anteprima TV · Demo')); assert(result.classicEntry && result.imageLoaded && result.localAssets && result.noTools);
  await writeFile(`${outputDir}/file-metrics.json`, JSON.stringify({ ...result,
    limitations: 'Edge file-scheme with normal browser security; validates local startup and interactions, not TV webOS lifecycle, Back461 or hardware performance.' }, null, 2));
  await context.call('Page.navigate', { url: context.baseUrl });
  await context.waitReady('document.querySelectorAll(".app-card").length===7');
}
