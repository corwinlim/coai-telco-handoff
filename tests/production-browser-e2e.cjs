'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');

(async () => {
  const url = process.env.COAI_URL || 'https://coai-telco-handoff.vercel.app/';
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    assert(response && response.ok(), 'Production homepage must return successful HTTP response');
    await page.locator('#scenario').waitFor();
    await page.selectOption('#scenario', '0');
    assert.equal(await page.locator('#incidentId').inputValue(), 'SIM-101');
    assert(await page.locator('#download').isDisabled(), 'Download must start disabled');
    assert(await page.locator('#approve').isDisabled(), 'Review checkbox must start disabled');

    await page.locator('#generate').click();
    assert(await page.locator('#report').innerText().then(t => t.includes('SIM-101')), 'Generated brief must include SIM-101');
    assert(await page.locator('#download').isDisabled(), 'Download must remain disabled before acknowledgement');
    await page.locator('#approve').check();
    assert(await page.locator('#download').isEnabled(), 'Approval must enable download');

    const pending = page.waitForEvent('download', { timeout: 20000 });
    await page.locator('#download').click();
    const download = await pending;
    assert.equal(download.suggestedFilename(), 'coai-handoff-SIM-101.txt');
    const filename = await download.path();
    const body = fs.readFileSync(filename, 'utf8');
    assert(body.includes('SIM-101'), 'Export must contain incident ID');
    assert(body.includes('SYNTHETIC / UNVERIFIED'), 'Export must preserve synthetic disclosure');

    await page.locator('#symptom').fill('Edited fictional report for review-invalidation test');
    assert(await page.locator('#download').isDisabled(), 'Input edit must revoke download approval');
    assert(await page.locator('#approve').isDisabled(), 'Input edit must revoke review');
    await page.locator('#generate').click();
    assert(await page.locator('#download').isDisabled(), 'Regeneration must require new acknowledgement');

    console.log('PRODUCTION_CHROMIUM_E2E=PASS: synthetic selection, approval gate, TXT download and edit invalidation');
  } finally {
    await browser.close();
  }
})().catch(e => { console.error('PRODUCTION_CHROMIUM_E2E=FAIL', e); process.exitCode = 1; });
