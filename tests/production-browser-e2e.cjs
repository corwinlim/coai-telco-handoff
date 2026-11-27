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

    // Regression for real-user Generate complaint: validation, result feedback and visibility.
    await page.locator('#symptom').fill('');
    await page.locator('#generate').click();
    assert((await page.locator('#validation').innerText()).includes('Cannot generate'), 'Missing symptom should show a visible validation reason');
    assert(await page.locator('#approve').isDisabled(), 'Invalid generate must not enable approval');
    await page.locator('#scenario').selectOption('1');
    await page.locator('#scenario').selectOption('0');
    await page.locator('#generate').click();
    assert((await page.locator('#generateStatus').innerText()).includes('Report generated: SIM-101'), 'Generate must visibly confirm success');
    assert(await page.locator('#report').innerText().then(t => t.includes('SIM-101')), 'Generated brief must include SIM-101');
    assert(await page.locator('#report').evaluate(el => { const r=el.getBoundingClientRect();return r.top >= -2 && r.top < window.innerHeight; }), 'Generate must scroll report into viewport');
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

    // Independent mobile-sized context exercises selection, review, export and edit invalidation.
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
      acceptDownloads: true
    });
    try {
      const mobile = await mobileContext.newPage();
      const mobileResponse = await mobile.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      assert(mobileResponse && mobileResponse.ok(), 'Mobile homepage must load');
      assert(await mobile.locator('#scenario').isVisible(), 'Mobile selector must be visible');
      await mobile.selectOption('#scenario', '9');
      assert.equal(await mobile.locator('#incidentId').inputValue(), 'SIM-110');
      assert(await mobile.locator('#generate').isVisible(), 'Mobile Generate button must be visible');
      await mobile.locator('#generate').click();
      assert((await mobile.locator('#generateStatus').innerText()).includes('Report generated: SIM-110'));
      assert(await mobile.locator('#report').innerText().then(t => t.includes('SIM-110')), 'Mobile brief must include SIM-110');
      assert(await mobile.locator('#download').isDisabled(), 'Mobile export must be blocked before review');
      await mobile.locator('#approve').check();
      const mobilePending = mobile.waitForEvent('download', { timeout: 20000 });
      await mobile.locator('#download').click();
      const mobileDownload = await mobilePending;
      assert.equal(mobileDownload.suggestedFilename(), 'coai-handoff-SIM-110.txt');
      assert(fs.readFileSync(await mobileDownload.path(), 'utf8').includes('SYNTHETIC / UNVERIFIED'));
      await mobile.locator('#impact').fill('Edited fictional impact for mobile retest');
      assert(await mobile.locator('#download').isDisabled(), 'Mobile edits must revoke export');
      console.log('MOBILE_CHROMIUM_E2E=PASS: 390px viewport, SIM-110, gated TXT export and edit invalidation');
    } finally {
      await mobileContext.close();
    }
    console.log('PRODUCTION_CHROMIUM_E2E=PASS: desktop SIM-101 and mobile SIM-110');
  } finally {
    await browser.close();
  }
})().catch(e => { console.error('PRODUCTION_CHROMIUM_E2E=FAIL', e); process.exitCode = 1; });
