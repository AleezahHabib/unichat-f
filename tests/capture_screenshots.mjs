import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const screenshotDir = path.resolve('public', 'screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function getAuthToken() {
  const res = await fetch('http://127.0.0.1:8000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alice_e2e@example.com', password: 'Password123!' }),
  });
  if (!res.ok) throw new Error('Failed to authenticate: ' + res.statusText);
  const data = await res.json();
  return data.access_token;
}

async function getWorkspaces(token) {
  const res = await fetch('http://127.0.0.1:8000/workspaces', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

async function main() {
  const token = await getAuthToken();
  const workspaces = await getWorkspaces(token);
  const targetWs = workspaces[0];

  const browser = await chromium.launch({ headless: true });

  // 1. Landing Page Desktop (Light & Dark)
  console.log('1. Capturing Landing Page...');
  const landingCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const landingPage = await landingCtx.newPage();
  await landingPage.goto('http://localhost:3000');
  await landingPage.waitForSelector('nav');
  await landingPage.waitForTimeout(1000);
  
  await landingPage.screenshot({ path: path.join(screenshotDir, 'landing_1440_light.png') });
  
  await landingPage.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await landingPage.waitForTimeout(500);
  await landingPage.screenshot({ path: path.join(screenshotDir, 'landing_1440_dark.png') });
  await landingCtx.close();

  // 2. Workspace Desktop with Switcher open (Light & Dark)
  console.log('2. Capturing Workspace Desktop...');
  const appCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await appCtx.addInitScript((tok) => {
    window.localStorage.setItem('unichat_token', tok);
  }, token);

  const appPage = await appCtx.newPage();
  await appPage.goto(`http://localhost:3000/workspace/${targetWs.id}`);
  await appPage.waitForSelector('aside', { timeout: 15000 });
  await appPage.waitForTimeout(1000);

  // Open switcher
  const switcher = await appPage.$('aside button[aria-haspopup="true"]');
  if (switcher) {
    await switcher.click();
    await appPage.waitForTimeout(500);
  }

  await appPage.screenshot({ path: path.join(screenshotDir, 'desktop_1440_light.png') });

  // Dark mode
  await appPage.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await appPage.waitForTimeout(500);
  await appPage.screenshot({ path: path.join(screenshotDir, 'desktop_1440_dark.png') });
  await appCtx.close();

  // 3. Mobile 375px (Light & Dark)
  console.log('3. Capturing Mobile Views...');
  const mobileCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  await mobileCtx.addInitScript((tok) => {
    window.localStorage.setItem('unichat_token', tok);
  }, token);

  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto(`http://localhost:3000/workspace/${targetWs.id}`);
  await mobilePage.waitForSelector('button[aria-label="Open navigation menu"]', { timeout: 15000 });
  await mobilePage.waitForTimeout(1000);

  const menuBtn = await mobilePage.$('button[aria-label="Open navigation menu"]');
  if (menuBtn) {
    await menuBtn.click();
    await mobilePage.waitForTimeout(500);
  }

  await mobilePage.screenshot({ path: path.join(screenshotDir, 'mobile_375_light.png') });

  await mobilePage.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(screenshotDir, 'mobile_375_dark.png') });
  await mobileCtx.close();

  await browser.close();
  console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
}

main().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
