import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';

const base = (process.env.PORTFOLIO_URL || 'http://localhost:5173').replace(/\/$/, '');
const artifactPath = new URL('../outputs/', import.meta.url);
await fs.mkdir(artifactPath, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errors = [];
const checks = [];
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const response = await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200);
  await page.getByRole('heading', { name: 'Engineering intelligence.' }).waitFor();
  await page.waitForTimeout(600);
  assert.equal(await page.title(), 'Romit Addagatla — Python AI Engineer');
  assert.equal(await page.locator('.project-card').count(), 4);
  assert.equal(await page.locator('.timeline-row').count(), 3);
  await page.screenshot({ path: new URL('desktop-hero.png', artifactPath).pathname });
  checks.push('Desktop route, title, four projects, and three experience entries');

  const expected = [
    ['GuardNet', 'https://github.com/romit-23/GuardNet'],
    ['RAG for Hotels', 'https://github.com/romit-23/RAG-Model-for-Hotels'],
    ['Financial Fraud Detection', 'https://github.com/romit-23/Fraud-Detection-Model'],
    ['News, beyond language', 'https://github.com/romit-23/News-translation-and-TTS'],
  ];
  for (const [title, link] of expected) {
    const trigger = page.getByRole('button', { name: `Explore ${title}`, exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    await page.waitForTimeout(300);
    const box = await dialog.boundingBox();
    const style = await dialog.evaluate(el => { const s = getComputedStyle(el); return { className:el.className, position:s.position, top:s.top, left:s.left, translate:s.translate, transform:s.transform, opacity:s.opacity, zIndex:s.zIndex }; });
    assert(box.x >= 0 && box.y >= 0 && box.x + box.width <= 1441 && box.y + box.height <= 1001, `Dialog inside viewport: ${JSON.stringify({box, style})}`);
    assert.equal(await dialog.getByRole('link', { name: 'View source on GitHub' }).getAttribute('href'), link);
    if (title === 'GuardNet') {
      assert.equal(await dialog.getByRole('link', { name: 'IEEE publication' }).getAttribute('href'), 'https://ieeexplore.ieee.org/document/11284226');
      await page.screenshot({ path: new URL('project-detail.png', artifactPath).pathname });
    }
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    await expect(trigger).toBeFocused();
  }
  checks.push('Every project dialog, original repository links, IEEE link, Escape, and focus restoration');

  await page.getByRole('tab', { name: 'Backend & data' }).click();
  await page.getByRole('tabpanel').getByText('PostgreSQL', { exact: true }).waitFor();
  await page.getByRole('tab', { name: 'Tools & deployment' }).click();
  await page.getByRole('tabpanel').getByText('MLflow', { exact: true }).waitFor();
  await page.getByRole('tab', { name: 'AI & machine learning' }).click();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Backend & data' })).toHaveAttribute('data-state', 'active');
  checks.push('Skills tabs and keyboard navigation');

  const resumeLink = await page.getByRole('link', { name: 'Download resume', exact: true }).getAttribute('href');
  const resumeUrl = new URL(resumeLink, page.url()).href;
  assert.equal(new URL(resumeUrl).pathname, '/MyPortfolio/Romit-Addagatla-Resume.pdf');
  const resume = await context.request.get(resumeUrl);
  assert.equal(resume.status(), 200);
  assert.equal((await resume.body()).subarray(0, 5).toString(), '%PDF-');
  const sourceResume = await fs.readFile(new URL('../site/public/Romit-Addagatla-Resume.pdf', import.meta.url));
  assert.deepEqual(await resume.body(), sourceResume);
  checks.push('Download serves the unchanged original resume PDF');

  await page.getByRole('button', { name: 'Copy email address' }).click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'addromit2307@gmail.com');
  await page.getByRole('button', { name: 'Pause decorative animations' }).click();
  assert.equal(await page.locator('.ticker-track').evaluate(el => getComputedStyle(el).animationPlayState), 'paused');
  await page.getByRole('button', { name: 'Resume decorative animations' }).click();
  checks.push('Email clipboard action and decorative animation pause');

  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
    await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({ top: 0, behavior: 'instant' }); });
    await page.waitForTimeout(300);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `No horizontal overflow at ${width}px`);
    if (width < 600) {
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await page.getByRole('navigation').getByRole('link', { name: 'Experience', exact: true }).click();
      await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');
      await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({ top: 0, behavior: 'instant' }); });
      await page.waitForTimeout(600);
      await page.screenshot({ path: new URL(`mobile-${width}.png`, artifactPath).pathname });
      await page.getByRole('button', { name: 'Explore GuardNet', exact: true }).click();
      await page.waitForTimeout(300);
      const mobileBox = await page.getByRole('dialog').boundingBox();
      assert(mobileBox.x >= 0 && mobileBox.y >= 0 && mobileBox.x + mobileBox.width <= width + 1 && mobileBox.y + mobileBox.height <= 845, `Mobile dialog inside ${width}px viewport`);
      await page.keyboard.press('Escape');
    }
  }
  checks.push('Responsive layouts at 1440, 1024, 768, 390, and 320 pixels; mobile navigation');

  await page.setViewportSize({ width: 1440, height: 1000 });
  for (let offset = 0; offset < await page.evaluate(() => document.body.scrollHeight); offset += 750) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), offset);
    await page.waitForTimeout(140);
  }
  await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({ top: 0, behavior: 'instant' }); });
  await page.waitForTimeout(500);
  await page.screenshot({ path: new URL('desktop-full.png', artifactPath).pathname, fullPage: true });

  const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reducedPage = await reduced.newPage();
  reducedPage.on('pageerror', error => errors.push(error.message));
  reducedPage.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await reducedPage.goto(`${base}/`, { waitUntil: 'networkidle' });
  assert.equal(await reducedPage.locator('.ticker-track').evaluate(el => getComputedStyle(el).animationName), 'none');
  assert.equal(await reducedPage.getByRole('heading', { name: 'Engineering intelligence.' }).evaluate(el => getComputedStyle(el).opacity), '1');
  checks.push('Reduced-motion preference disables continuous animation and keeps content visible');
  assert.deepEqual(errors, [], 'No browser runtime errors');
  checks.push('No browser runtime errors');
  console.log(JSON.stringify({ passed: checks, screenshots: artifactPath.pathname }, null, 2));
} finally {
  await browser.close();
}
