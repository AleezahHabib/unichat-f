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
  if (!res.ok) throw new Error('Failed to authenticate alice_e2e: ' + res.statusText);
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
  console.log('Using Workspace:', targetWs.name, targetWs.id);

  const browser = await chromium.launch({ headless: true });

  // 1. Desktop 1440px Light Mode
  console.log('1. Capturing Desktop 1440px Light Mode...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
  });
  await desktopContext.addInitScript((tok) => {
    localStorage.setItem('unichat_token', tok);
  }, token);

  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(`http://localhost:3000/workspace/${targetWs.id}`);
  await desktopPage.waitForSelector('aside', { timeout: 15000 });
  await desktopPage.waitForTimeout(1500);

  // Open Workspace Switcher dropdown
  const switcherBtn = await desktopPage.$('aside button[aria-haspopup="true"]');
  if (switcherBtn) {
    await switcherBtn.click();
    await desktopPage.waitForTimeout(600);
  }

  const desktopLightPath = path.join(screenshotDir, 'desktop_1440_light.png');
  await desktopPage.screenshot({ path: desktopLightPath, fullPage: false });
  console.log('Saved:', desktopLightPath);

  // 2. Desktop 1440px Dark Mode
  console.log('2. Capturing Desktop 1440px Dark Mode...');
  await desktopPage.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await desktopPage.waitForTimeout(600);
  const desktopDarkPath = path.join(screenshotDir, 'desktop_1440_dark.png');
  await desktopPage.screenshot({ path: desktopDarkPath, fullPage: false });
  console.log('Saved:', desktopDarkPath);
  await desktopContext.close();

  // 3. Mobile 375px Light Mode
  console.log('3. Capturing Mobile 375px Light Mode...');
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    colorScheme: 'light',
  });
  await mobileContext.addInitScript((tok) => {
    localStorage.setItem('unichat_token', tok);
  }, token);

  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`http://localhost:3000/workspace/${targetWs.id}`);
  await mobilePage.waitForSelector('button[aria-label="Open navigation menu"]', { timeout: 15000 });
  await mobilePage.waitForTimeout(1000);

  // Open mobile slide-over sidebar
  const menuBtn = await mobilePage.$('button[aria-label="Open navigation menu"]');
  if (menuBtn) {
    await menuBtn.click();
    await mobilePage.waitForTimeout(600);
  }

  const mobileLightPath = path.join(screenshotDir, 'mobile_375_light.png');
  await mobilePage.screenshot({ path: mobileLightPath, fullPage: false });
  console.log('Saved:', mobileLightPath);

  // 4. Mobile 375px Dark Mode
  console.log('4. Capturing Mobile 375px Dark Mode...');
  await mobilePage.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await mobilePage.waitForTimeout(600);
  const mobileDarkPath = path.join(screenshotDir, 'mobile_375_dark.png');
  await mobilePage.screenshot({ path: mobileDarkPath, fullPage: false });
  console.log('Saved:', mobileDarkPath);
  await mobileContext.close();

  await browser.close();
  console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
}

main().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
